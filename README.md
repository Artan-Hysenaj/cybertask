### READ ME

We are using the [dummyJSON](https://dummyjson.com/) api to simulate a phone book api since we couldn't find any that fits our need.
Create and update do not change anything on the server which is a dummyJSON api limitation, we are going around this by still making the 
request to create or update but we optimistically update the app state in order to fake the functionality.


## Installation

1. Clone the repository
   ```git clone #repo#```
2. Install dependencies
    ```npm install```

## Usage

1. Start the development server ```npm run dev```
2. Build for production ```npm run build```

## Libraries and frameworks used

- Vite
- React
- TypeScript
- Tailwind CSS
- Antd
- tanstack/react-query
- react-highlight-words

## Structure 
###### described by ChatGPT

- The `src` directory is where the main source code of the application lives.
- Inside src, the `api` directory contains code related to the application's backend and networking.
- The `assets` directory contains images and other assets used by the application.
- The `components` directory contains reusable components that can be used throughout the application.
- The `lib` directory contains helper functions that are used throughout the application.
- The `hooks` directory contains custom React hooks that are used throughout the application.
- The `i18n` directory contains code related to internationalization.
- The `navigation` directory contains code related to routing and navigation.
- The `screens` directory contains code for the different screens or pages of the application.
- The `store` directory contains code related to the application's state management.
- The `styles` directory contains styles for the application.
- The `types` directory contains TypeScript type definitions for the application.
