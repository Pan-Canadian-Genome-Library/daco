# PCGL DACO Email Solution

## Summary

The DACO API application provides a email service that will trigger on specific events after each change to the application state. PCGL will point directly to the email provider to send emails. PCGL implementation utilizes a couple of key technologies to enhance both the developer experience as well as client facing UI/UX design. 

# Usage of libraries with PCGL API

Emails will be handled on the service layer directly into the pcgl api repository. 
Some core technologies to note will be the following:
 
 1. Nodemailer
 2. MJML
 3. Mailhog (Local testing tool for sending emails)

## Nodemailer

Documentation: https://www.nodemailer.com/

Nodemailer is a package tailored for sending emails in Node.js applications, offering a robust solution that makes email sending straightforward and reliable.
Benefits to using nodemailer is setup process is extremely simple, well documented, zero dependencies and ease of use.

## Mailhog

Documentation: https://github.com/mailhog/MailHog
Image: docker.io/jcalonso/mailhog:latest

Mailhog is a email testing provider that will run as a separate service within the docker container. Locally, when email events are triggered, and the configurations for nodemailer are implemented properly, Mailhog will receive 
the email and display its contents.

NOTE: mailhog/mailhog image has outstanding issues with apple silicon chips, this forked image is an alternative

```yml
  mailhog:
    image: docker.io/jcalonso/mailhog:latest
    container_name: mailhog
    ports:
      - '1025:1025'
      - '8025:8025'
```


## MJML

Documentation: https://mjml.io/

Mjml is a markup language that is designed to help the developer experience of writing email friendly templates. This language will complie down to responsive html code, so it helps removes the headaches that
comes with writing email compatible html code.

### Methods of Generating HTML code with MJML

MJML Preview vs-code Extension: https://marketplace.visualstudio.com/items?itemName=mjmlio.vscode-mjml

Creating a mjml file has many benefits. For instance if using vscode, you can visually preview the mjml code without actually sending the email. This helps the development experience, as developers won't have to worry about triggering an event to see the changes in mailhog and any email provider services. The method of actually converting mjml syntax to html is were things get a little bit complex/opinionated.

There are many ways of creating html code with mjml.

1. Creating a mjml file and reading using the CLI to generate html file then reading that generated file via `fs.readfile`
2. Creating a mjml file and reading the file via `fs.readfile` then using `mjml2html` to convert
3. Creating a mjml syntax directly into a string then using `mjml2html`.

For PCGL, the current solution is option 3 of creating mjml syntax directly into the string. The reason for this is that point 1 and 2 has some downsides to consider for the future development:

For point 1, generating templates locally will create more files, so if we had 9 mjml templates, we'd have to generate 9 html files and then read those files into our nodemailer.
For point 2, it is a more cleaner and reduces files, but has a issue with inserting dynamic variables into the mjml template, which does have a solution to that, but with a caveat which leads into the next point.

Translations is a consideration when picking which method of converting mjml code into html. For points 1 and 2, the text would be hardcoded into the actual mjml file vs just a string with point 3. It would be
added complexity to switch text from french to english, on top of dynamically adding variables to each of the templates. Since we do not have a translation solution pre-mvp for the backend service, point 3 will provide a 
generic enough solution that will work for our needs and simple enough to handle refactors when translations is introduced post-mvp.

### Creating a Template

If you want to preview a new template, my recommendation for now is to create a mjml file and import it into the `source.mjml` like the following:

```html
    ...
    <mj-wrapper mj-class="section-background">
      <mj-section css-class="main-content">
        <!-- TEST TEMPLATE HERE -->
        <mj-include path="./components/{your-test-template}.mjml" />
      </mj-section>
    </mj-wrapper>
    ...
```
then preview that `source.mjml` file. The styles should be already applied via `head.mjml` and `styles.mjml`.
Now you should be able to add mjml code to that file and see all the changes.
If everything looks as expected, copy the file text and paste it into a string, here's an example:

```ts
	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear ${name},
                </mj-text>
                <mj-text>
                    Thank you for submitting <a href="${ui}/application/${id}" target="_blank" rel="nofollow">your application</a> to the PCGL DACO. After careful review, we regret to inform you that your application has not been approved. As a result, you will not have access to the requested data.
                </mj-text>
                ...
            </mj-column>
`;

	return basicLayout({ body: template }).html;

```

### Creating styles

You can add styles via `styles.mjml` or `head.mjml`, some styles will not work on some mjml component such as `<mj-wrapper>` which is styles defined in the `head.jml`,
but more classic styles with css can be added to `styles.mjml` and apply the relevant css class naming with `css-class`.

## Alternative solutions

OHCRN has a alternative solution for their email service. OHCRN has a microservice architecture, as such they have many different services that may or may not need emails. So instead of creating a email service directly into the service that needed it. They created a separate microservice to handle their emails. Since PCGL's architecture is not a microservice type application, it was more fitting to just have emails apart of the backend. 

## Translations

As of 04-16-2025, translations into other languages other than english is not implemented. As such the current solution reflects a generic and clean enough implementation that will allow easy refactoring post MVP.