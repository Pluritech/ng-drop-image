import { browser, by, element } from 'protractor';

export class NgDropImagePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('pluri-root h1')).getText();
  }
}
