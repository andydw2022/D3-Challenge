# D3 Homework - Data Journalism and D3


## Background

This web page shows the health risks facing particular US demographics. In particular it will show scatter plots plotted with axes : 
 X-Axis 
   Poverty (%), 
   Median Age (years)
   Median Houshold Income ($)  
 Y-Axis 
   Healthcare(%), 
   Smokers(%) 
   Obesity(%) 

The data set included with the assignment is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). The current data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

The folder structure is as follows:

index.html
README.md
assets\css
      \d3Style.css
      \style.css
assets\data
      \data.csv
assets\js
      \js\.eslintrc.json
      \js\app.js


The data is read in using the d3.csv function from the file data/data.csv. The initial axes to be plotted on loading is :
Poverty vs Healthcare

To see display the web page index,html:
   1. At a command prompt :  python -m http.server 8000
   2. Then open a web browser at http://localhost:8000/.

All the CSV data was bound to the circles so that when the circles were replotted with new x,y values the data moved with the
circles.

#### . Incorporate d3-tip
The `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged) was used to reveal a specific element's 
data when the user hovers their cursor over the element.

