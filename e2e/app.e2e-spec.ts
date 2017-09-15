import { NgDropImagePage } from './app.po';

describe('ng-drop-image App', () => {
  let page: NgDropImagePage;

  beforeEach(() => {
    page = new NgDropImagePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to pluri!!');
  });
});
