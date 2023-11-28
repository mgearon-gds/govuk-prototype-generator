const express = require('express');
const app = express();
const sass = require('sass');
const path = require('path');
const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();
const htmlTemplate = require('./public/templates/htmlTemplate'); // Import the HTML template


app.use(express.json());
app.use(express.static('public'));


app.post('/sendToOpenAI', async (req, res) => {
  const question = req.body.question;
  const openai = new OpenAI();
  
  try {
  	const completion = await openai.chat.completions.create({
  		messages: [
		{
			role: "system", 
			content: "You are a code generator. You only respond with HTML code that uses  components and patterns from the GOV.UK Design System, and nothing else.\n\nYou need to pick the right components, for example accordions or lists. You also need to use the right patterns and recognise when something should be formatted as a start page or a question page or a task.\n\nOnly include main content that's inside <main>. IGNORE metadata (<meta>), header (<header>) and footer (<footer>). Don't include anything that isn't code. Only respond with code as plain text without code block syntax around it."
		},
		{
			role: "user",
			content: question
		}],
		max_tokens: 2794,
		model: "gpt-3.5-turbo-1106"
  	});

    const htmlContent = completion.choices[0].message.content;
    const filename = `${Date.now()}.html`;

    fs.writeFile('public/' + filename, htmlTemplate(htmlContent), (err) => {
      if (err) {
        console.error('Error writing file:', err);
      }
    });

    const responseObj = {
      filename: filename,
      completion: completion // or any other data you want to include
    };

    res.json(responseObj);


  } catch(error) {
  	console.error('Error in OpenAI API call:', error);
      return res.status(500).send('Error processing the request');
  }

});

const port = 3000;
app.listen(port, () => {
	console.log('Server running at http://localhost:3000');
})