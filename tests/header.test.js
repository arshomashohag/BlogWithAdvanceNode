const Page = require('./helper/page');
let page;

beforeEach(async ()=>{
     
    page = await Page.build();

    await page.goto('http://localhost:3000');
    
});

afterEach(async ()=>{

    await page.close();
});


test("Test header, check brand text", async ()=>{
    await page.waitFor('a.brand-logo');
    const headerLogoText = await page.getContentsOf('a.brand-logo');
    expect(headerLogoText).toEqual('Blogster'); 
    
});

test("Hit the login with google, check if it navigates to auth flow", async ()=>{

    await page.waitFor('.right a');
    await page.click(".right a");

    const pageUrl = await page.url();

    expect(pageUrl).toMatch(/accounts\.google\.com/);

});

test("Sign in to the app, check logout button", async ()=>{

    await page.login();
    const logoutText = await page.getContentsOf('.right li:nth-child(2) a');

    expect(logoutText).toEqual("Logout");

});