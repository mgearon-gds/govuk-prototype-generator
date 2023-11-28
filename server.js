const express = require('express');
const app = express();
const sass = require('sass');
const path = require('path');
const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

//Templates
const htmlTemplate = require('./public/templates/htmlTemplate'); // Import the HTML template
const instructionsContent = require('./public/templates/instructions'); // Import the instructions content
const directoryTemplate = require('./public/templates/directoryTemplate'); // Import the directory template


app.use(express.json());
app.use(express.static('public'));

let generatedPages = []; // Keep track of generated pages

app.post('/sendToOpenAI', async (req, res) => {
  const question = req.body.question;
  const openai = new OpenAI();
  
  try {
  	const completion = await openai.chat.completions.create({
  		messages: [
		{
			role: "system", 
      content: instructionsContent, // Use the imported instructions content
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

    fs.writeFile('public/pages/' + filename, htmlTemplate(htmlContent), (err) => {
      if (err) {
        console.error('Error writing file:', err);
      }
    });

    // Update the generated pages list
    const newPage = {
      filename: filename,
      completion: completion,
    };
    generatedPages.push(newPage);

    // Update the directory page
    fs.writeFile('public/directory.html', directoryTemplate(generatedPages), (err) => {
      if (err) {
        console.error('Error writing directory file:', err);
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