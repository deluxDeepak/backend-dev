# Backend Development Notes

## File Handling Strategy

- Temporary video/image files ko server par store karein.
- Uske baad, unhe kisi third-party cloud service (jaise Cloudinary, AWS S3) par upload kar dein.

---

## Important Packages & Concepts

### 1. Prettier (Code Formatter)

- **Installation**:
  ```bash
  npm i -D prettier
  ```
- **Purpose**: Prettier ek opinionated code formatter hai. Yeh aapke code ko parse karke, apne rules ke hisaab se re-print karta hai, jisse poore project me code style consistent rehta hai.
- **Configuration**:
  - `.prettierrc`: Is file me Prettier ke liye rules configure kiye jaate hain.

### 2. `package.json` Scripts

- Development server chalaane ke liye script:
  ```json
  "scripts": {
    "dev": "nodemon src/index.js"
  }
  ```
- Ab aap `npm run dev` command se server start kar sakte hain.

### 3. `devDependencies`

- **Nodemon**: File changes detect hone par server ko automatically restart karta hai.
  - **Installation**:
    ```bash
    npm i -D nodemon
    ```

### 4. Express.js

- **Middleware**: Express me middleware functions request-response cycle ke beech me aate hain.
- **URL-encoded data**: URL se aane waale data (jaise form submissions) ko parse karne ke liye:
  ```javascript
  // extended: true allows for rich objects and arrays to be encoded
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  ```
- **Core Concepts**: `Request` aur `Response` objects.

### 5. Mongoose

- MongoDB ke liye ek Object Data Modeling (ODM) library. Yeh data ke beech relationships manage karne, schema validation provide karne, aur code me objects aur MongoDB me unke representation ke beech translate karne me madad karta hai.

### 6. CORS (Cross-Origin Resource Sharing)

- **Basic Setup**:
  ```javascript
  app.use(cors());
  ```
- **Allowing all origins**:
  - Environment variable `CORS_ORIGIN=*` set karne se kisi bhi origin se request allow ho jaati hai.
  - Production ke liye, security ke liye iske specific options ko explore karna zaroori hai.

### 7. `dotenv`

- **Purpose**: `.env` file se environment variables ko `process.env` me load karta hai.
- **Best Practice**: `dotenv` ko application me jitna jaldi ho sake, load karna chahiye.
- **Import Issue**: `import dotenv from "dotenv"` ko seedhe istemal karne se ES modules ke saath kabhi-kabhi problem aati hai.
- **Recommended Solution**: `package.json` script me `-r dotenv/config` flag ka istemal karein. Yeh ek clean approach hai.

### 8.Agregation queries for mongoose

npm i mongoose-aggregate-paginate-v2 ye humko power deta hai to make buld apply agregation in our model

### 9.File upload in backened

Mostly part backend se handle hota hai
Ye har jahag to use nahi hoga to isko ek seperate file me rakh sakte hai
Utilities bana denge isko
Jhan use karna hoga wahan use kar lenge

### 8. Node.js Error Handling

- Node.js ek global `Error` class deta hai. Isko extend karke aap custom error classes bana sakte hain, jisse error handling aur debugging behtar hoti hai.

### HTTP

<!-- Ye bus ek adress hai  -->

URL:Uniform resource locator
URI:Uniform resouce Identifier
URN:Uniform resource Name

### Logic building karo Dont write a single line of code without any logic

<!-- For register Users  -->

// Logic Building kaise hota hai
// ->Get the user details from body
// ->User details ko verify karo
// ->Check lgao ki user details provided hai ya nahi
// ->Find the user If the user exist show the error
// ->upload the details in db
// ->Upload the image and Cover image to the cloudinary
// ->Save the details temporary in the server



<!-- New syntax for me  -->
```js 
if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
throw new ApiError("All fields are require ");
}

```
