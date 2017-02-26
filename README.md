# vientos-nahual

[![Build Status](https://travis-ci.org/ehecame/vientos-nahual.svg?branch=master)](https://travis-ci.org/ehecame/vientos-nahual)
[![codecov](https://codecov.io/gh/ehecame/vientos-nahual/branch/master/graph/badge.svg)](https://codecov.io/gh/ehecame/vientos-nahual)
[![Code Climate](https://codeclimate.com/github/ehecame/vientos-nahual/badges/gpa.svg)](https://codeclimate.com/github/ehecame/vientos-nahual)
[![bitHound Code](https://www.bithound.io/github/ehecame/vientos-nahual/badges/code.svg)](https://www.bithound.io/github/ehecame/vientos-nahual)
[![bitHound Dependencies](https://www.bithound.io/github/ehecame/vientos-nahual/badges/dependencies.svg)](https://www.bithound.io/github/ehecame/vientos-nahual/master/dependencies/npm)
[![NSP Status](https://nodesecurity.io/orgs/vientos/projects/43149b48-d35a-4c5d-9d7c-ef24383fcb70/badge)](https://nodesecurity.io/orgs/vientos/projects/43149b48-d35a-4c5d-9d7c-ef24383fcb70)

frontend mutante para vientos


## dev setup

```shell
npm install
bower install
cp config.example.json config.json
npm run bundle
polymer serve
```

### multilingual

Project uses [Polymer.AppLocalizeBehavior](https://elements.polymer-project.org/elements/app-localize-behavior) please always add new strings to `labels.json` in [vientos-data](https://github.com/ehecame/vientos-data) and **never hardcode untranslated strings** in any of the templates!
