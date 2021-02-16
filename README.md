## pif-covid19-scanner-federalist
* [General Info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General Info
IMPORTANT! This project is as of today live at https://covid19screen.oit.va.gov/ via Federalist

This project is intended for generating a custom Covid-19 Self-Screening webpage for an agency, or building. It is primarily a directed graph/flow-chart style application, where information is shown based on the user's answers to a question.

This project works in tandem with Federalist. It generates a number of self-contained html web pages in the `_site` folder. The web pages are created from the `site.template.html` file.

The project uses two configuration js files that configure the look and feel and the flow of questions.
* `Facilities.js`: 
  * Is an array of JSON objects that configure the main facility information, such as VA, VACO, GSA, etc. 
  * Configures the look and feel 
  * Points to the flowchart id that is connected with a facility
  * Has boolean controls such as `default` (to create an index.html for this facility) and `generate_site` (to enable or disable creation of an html webpage for this element)
* `Flowcharts.js`: Is an array of JSON objects that configure the flow of questions and statements.

The project has a `federalist_site_generator.js` file that is run automatically by the federalist engine everytime a github modification is detected. For each facility defined in the `Facilities.js` file that has the `generate_site: true` flag, a web page is created as `facility_id.flowchart_id.html`. If the `default: true` flas is set for a facility, then for that facility an `index.html` file is generated.

## Technologies
* HTML
* JS
* uswds

## Setup
1. Configure `Facilities.js` by adding the facility information. 
2. Configure `Flowcharts.js` by adding the flow of questions and answers. You can use a preexisting flowchart as well.

For local testing:
1. Configure the `BASE_URL` variable in the `federalist_site_generator.js` like this:
```javascript
    base_url_str = './';
```    
2. Run the `node federalist_site_generator.js` from the root folder of the project
3. Test the files that are generated in the `_site` folder

# BEFORE UPDATING THE REPO ON GITHUB
Make sure you have removed / commented out the base url string in the `federalist_site_generator.js` file:
```javascript
    // base_url_str = './';
```
