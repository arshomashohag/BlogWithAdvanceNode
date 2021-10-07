const Page = require('./helper/page');

let page;

beforeEach(async ()=>{
    page = await Page.build();
    await page.goto('http://localhost:3000');
});


afterEach(async ()=>{
    page.close();
});

describe('When logged in', async ()=> {

    beforeEach(async ()=>{
        await page.login();
        await page.waitFor('a[href="/blogs/new"]');
        await page.click('a[href="/blogs/new"]');
    })

    test('Can see new blog create form', async ()=>{    
         
        const labels = await page.getContentsOfAll(['form div.title label', 'form div.content label']);

        expect(labels.sort()).toEqual(['Blog Title', 'Content'].sort());
    
    });

    describe('And form contains invalid inputs', async ()=>{
        beforeEach(async ()=>{
            await page.click('form button[type="submit"]');
        })

        test('Can see error message', async ()=>{ 
            const errorMessages = await page.getContentsOfAll(['form div.title div.red-text', 'form div.content div.red-text']);
            expect(errorMessages.sort()).toEqual(['You must provide a value', 'You must provide a value'].sort());
    
        });
    });

    describe('And form contains valid inputs', async ()=>{

        beforeEach(async ()=>{
            await page.type('form div.title input', 'Test Title');
            await page.type('form div.content input', 'Test Content');
            await page.click('form button[type="submit"]');
        });

        test('Submitting form takes us to review screen', async ()=>{
            const reviewTitle = await page.getContentsOf('form h5');

            expect(reviewTitle).toEqual('Please confirm your entries');
        });

        test('Saving the blog creates a new blog in blog list page', async ()=>{
            await page.click('form button.green');
            await page.waitFor('.card-stacked .card-content .card-title');

            const blogContents = await page.getContentsOfAll(['.card-stacked .card-content .card-title', '.card-stacked .card-content p']);
             
            expect(blogContents.sort()).toEqual(['Test Title', 'Test Content'].sort());
        });
    });
    

});


describe('When not logged in', async ()=>{

    test('Blog actions are prohibited', async ()=>{
        const actions = [
            {
                method: 'get',
                path: '/api/blogs'
            },
            {
                method: 'post',
                path: '/api/blogs',
                data: {
                    title: 'Test title',
                    content: 'Test content'
                }
            }
        ]
    
        const actionsResult = await page.execActions(actions);
    
        for(let result of actionsResult){
            expect(result).toEqual({error: "You must log in!"});
        }
    });
    
});


