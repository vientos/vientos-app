# vientos-app

[![Build Status](https://travis-ci.org/vientos/vientos-app.svg?branch=staging)](https://travis-ci.org/vientos/vientos-app)
[![Code Climate](https://codeclimate.com/github/vientos/vientos-app/badges/gpa.svg)](https://codeclimate.com/github/vientos/vientos-app)
[![bitHound Code](https://www.bithound.io/github/vientos/vientos-app/badges/code.svg)](https://www.bithound.io/github/vientos/vientos-app)

[![Greenkeeper badge](https://badges.greenkeeper.io/vientos/vientos-app.svg)](https://greenkeeper.io/)
[![bitHound Dependencies](https://www.bithound.io/github/vientos/vientos-app/badges/dependencies.svg)](https://www.bithound.io/github/vientos/vientos-app/staging/dependencies/npm)
[![NSP Status](https://nodesecurity.io/orgs/vientos/projects/8ce10402-be35-4831-bc4f-936d5a336d0b/badge)](https://nodesecurity.io/orgs/vientos/projects/8ce10402-be35-4831-bc4f-936d5a336d0b)
[![Known Vulnerabilities](https://snyk.io/test/github/vientos/vientos-app/badge.svg)](https://snyk.io/test/github/vientos/vientos-app)


## dev setup

```shell
yarn
bower install
cp config.example.json config.json
npm start
```

You will also need to run [vientos-service](https://github.com/vientos/vientos-service)


### multilingual

Project uses [Polymer.AppLocalizeBehavior](https://elements.polymer-project.org/elements/app-localize-behavior) please always add new strings to `labels.json` in [vientos-data](https://github.com/vientos/vientos-data) and **never hardcode untranslated strings** in any of the templates!
