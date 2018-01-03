## Georgetown Slavery Archive Digital Fellowship Project 

### Background 
The [Georgetown Slavery Archive (GSA)](http://slaveryarchive.georgetown.edu/) is an online, digital repository of archival material relating to slavery, Georgetown, and the Maryland Province of the Society of Jesus. The GSA was initiated in February 2016 by the [Working Group for Slavery, Memory, and Reconciliation](http://slavery.georgetown.edu/), and it continues to expand under the curation of [Professor Adam Rothman](https://gufaculty360.georgetown.edu/s/faculty-profile?netid=ar44%2F).

As the 2017-18 Digital Fellow, I am working to organize, store, and visualize the data embedded in the digital archive, specifically biographical and genealogical information on GU272 families (the Maryland Jesuit slave community) from Maryland to Louisiana and from slavery through emancipation.

------

### Goals
1. Build databases (MySQL/MongoDB) to organize and store biographical and genealogical information
2. Build an interface (ExpressJS/Node.JS) for GSA teammates to perform CRUD (create, read, update, delete) operations on data
3. Build web-based data visualizations (D3.js) using the cleaned data

------

### Demo

![Tree-Viz](tree-viz.gif)

------

### Directory Structure

* `data-visualization` contains the D3.js visualization drafts. These are now a part of the web application. 
    - `data-processing` contains scripts that convert csv to nested JSON.
* `web-app` contains the ExpressJS/Node.JS web application.

