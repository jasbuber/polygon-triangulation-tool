# Description

This tool performs a basic analysis of an image, detecting a polygon. Polygon then is represented as a set of vectors. Based on parameters in the web interface, it approximate the best possible scenario of filling the polygon with triangles. 

Parameters:
* inner point - number of points that are to be generated inside of the shape;
* border points - number of points that are to be generated ont the border of the shape;
* shape accuracy - how many vectors are supposed to be generated to describe shape ( usually the more the better );
* inner points accuracy - how evenly distributed should be the inner points that serve as one of the triangles vertices;
* background color - background color that is used to parse the image and find the shape

This tool works only if a shape is empty inside ( inside color is a background color ). For the proper image examples, refer to the /img directory.

# Prerequisites
* any web server

**DEVELOPMENT ONLY**
* [typescript](https://www.typescriptlang.org/)
* [http-server](https://www.npmjs.com/package/http-server)
* [watchify](https://github.com/browserify/watchify)

# Getting Started
Start a web server and open index.html.
