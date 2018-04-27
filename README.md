# Serverless Content Security Policy

This repository contains Lambda and Lambda@Edge functions to implement CSP HTTP headers with CloudFront.

HTTP Headers are injected as a Lambda@Edge function, and a Lambda function is created to be used as a reporting URL for CSP violations.

# Installation

Install pre-requisites with:

```
sudo npm i -g serverless
npm i
```

# Configuration

The `serverless.yml` file contains the configuration for the policy headers in the environment variables that are pushed.

The variables are:

* DEFAULT_SRC
* BASE_URI
* SCRIPT_SRC
* CONNECT_SRC
* IMG_SRC
* OBJECT_SRC
* MEDIA_SRC
* FRAME_SRC
* STYLE_SRC
* FONT_SRC
* REPORT_URI

For an understanding of what CSP can do, please read more here: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

Note that quoting here is important, and the sample configuration has a good overview of what that looks like.

# Deployment

## Push code
```
sls deploy -s prod --aws-profile YOURAWSPROFILE
```

## Create an origin for the CSP reporting endpoint in CloudFront

Select your CloudFront distribution, click on the 'Origins' tab, and click 'Create'.

Give it a name (eg: csp-lambda-apig')

In the 'Origin Domain Name', enter the API Gateway domain associated with Lambda. In origin path, enter '/prod'

Ex: RANDOMSTUFF.execute-api.us-east-1.amazonaws.com

Origin protocol policy should be set to 'HTTPS only'

Click 'Yes, Edit'.


## Associate the Lambda@Edge function with your cache behaviors

You can do this manually:

* Publish a version of the Lambda
* Go into the cache behaviours for your distribution and add the Lambda fully qualitified ARNs in 'Origin Response' request phase.

Or.... Automate it using code like this:

https://github.com/marksteele/lambdaAtEdgeToCloudFront

You could also just manage your CloudFront directly from the severless resources.