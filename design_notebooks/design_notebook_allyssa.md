**CSCI-310 Development Notebook**

---

**Guideline:** 

* Please document all your development activities, whether you use any AI coding tool or not. You might mix your manual coding or AI tool usage. Just document the entire process.   
  * If this is a team project or assignment, list all team members’ names in the “Name” field. For each iteration, record the name of the person who contributed any part of the work in the “What do you do?” field.  
* Any interactions with AI coding tools such as ChatGPT, Gemini, Copilot, and others must capture the full conversation history.   
* Use the format below to record your development activities in a clear and consistent manner.   
  * Adding more iteration sections if needed.

---

#### **Name:**
  Allyssa Dalton
#### **Project/Assignment:**
  Project 2
##### **Problem/Task:**
  Create a game
##### **Development Log**

- **Iteration 1:**  
  - **Goal/Task/Rationale:**  
    Set up index.html to host the game. 
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      I created a very simple and basic index.html file to view the game on a web browser. 
      
- **Response/Result:**
    index.html file created and filled out

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
  Done for now, but reevaluate after completing a bit of the world.  

- **Iteration 2:**  
  - **Goal/Task/Rationale:**  
    Create a main.js for a very basic rendering of a world to ensure I know what I'm doing. 
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      I used the inclass examples to help me set up the lightening, scene, camera, mushroom man and renderer to show a very very simple green grass, blue sky, and a mushroom man. 
      
- **Response/Result:**
  Simple world that I couldn't display due to a three.js error
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
  Error: Fix three.js issue

- **Iteration 3:**  
  - **Goal/Task/Rationale:**  
    Correct three.js import issue.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      Told CoPilot "#file:main.js (index):1 Uncaught TypeError: Failed to resolve module specifier "three". Relative references must start with either "/", "./", or "../"."
      
      Response:
      To fix this quickly for browser use, you should:
        Remove the import statement from main.js.
        Add a script tag in your index.html to load Three.js from a CDN before your main.js.
        In main.js, use THREE directly (no import needed).
- **Response/Result:**
    Issue Corrected

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
  Done

- **Iteration 4:**  
  - **Goal/Task/Rationale:**  
  Create trees!!!
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      I created a function to add a tree on the ground then called it add one at location 5, 1, 5.
      
- **Response/Result:**
    Tree was added, but the mushroom is the same size.

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
  Mushroom man size needs fixed.

- **Iteration 5:**  
  - **Goal/Task/Rationale:**  
    Fix the size ratio for mushroom and tree
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      I decided to make the mushroom shorter and skinnier, but I still didn't like how small the trees looked. I decided to make them taller, wider, and the leaves larger. 
      
- **Response/Result:**
    The size of mushroom to tree is good

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done


- **Iteration 6:**  
  - **Goal/Task/Rationale:**  
  Let the mushroom moves using WASD or arrow keys.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      I added a function to allow the character to move on key presses
      
- **Response/Result:**
  Character moves

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
  Done, but the character is able to move through objects

- **Iteration 7:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 



- **Iteration 8:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 

- **Iteration 9:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 

- **Iteration 10:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 

