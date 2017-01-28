# vientos-nahual
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
