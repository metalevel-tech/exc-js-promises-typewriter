# JavaScript Typewriter with Promises

A simple JavaScript application, that I was create while I was learning JavaScript promises.

The initial task: [Simple Joke Apps](https://wwwcourses.github.io/ProgressBG-JS-Advanced-React-Slides/pages/themes/WebServicesAndJSON/WebServicesAndJSON.html#/13).

The current implementation provides much functionalities, including: **1)** Typewriter effect with sound; **2)** DOM element to image implementation; **3)** Session records of the fetched jokes; **4)** Local storage for the user preferences; **5)** Dynamic fetch of all resources; **6)** Auto play feature; and more.

There are two variants of the `main.js` file. The only difference is within the main `Joke.prototype.jokeType()` method:

* [`main-one-speed-param.js`](./app/public/main-one-speed-param.js?plain=1#L178) has a single parameter for a single character write time (speed) - it uses the following code to loop over the text.

    ```js
    [...text].forEach((char, index, array) => {
        setTimeout(() => { typeSingleCharacter(char, index, array) }, index * speed);
    });
    ```

* [`main-two-speed-params.js`](./app/public/main-two-speed-params.js?plain=1#L178) has two parameters for a single character write time (speed), one for the character write itself and one for a delay after that - it uses the code below to loop over the text, respectively the function `typeSingleCharacter()` is modified to work with promises.

    ```js
    for (const index in text) {
        await typeSingleCharacter(text[index], index, text);
    }
    ```
