<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** github_username, repo_name, twitter_handle, email, project_title, project_description
-->


<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">DropIt</h3>

  <p align="center">
    The source code for the 'Drop It' android application.
    <br />
    <br />
    <a href="https://dropit-1550650811514.web.app/">Download</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Tested to be working with Node version 10.13.0
Consider using <a href="https://github.com/coreybutler/nvm-windows">NVM</a>.

Also requires Cordova version 8.1.2. Higher versions are known to cause errors.

* npm
  ```sh
  npm install -g node@10.13.0
  npm install -g cordova@8.1.2 
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/nyxenn/Drop-It.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the project
    ```sh
   ionic cordova run browser
   // or //
   ionic cordova prepare android
   ```
