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
      Copilot Prompt: "#file:main.js (index):1 Uncaught TypeError: Failed to resolve module specifier "three". Relative references must start with either "/", "./", or "../"."
      
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
  Make it look like evening time and add stars.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      Copilot Prompt: Can you make the sky look like it's evening time and add starts?
    
      Response: 
        Change the sky color:
        Set the scene background to a darker, evening-like color (such as deep blue or purple) using:
        scene.background = new THREE.Color(0x2c2255); // or another evening color
      Add stars:
        Create a function to add small white spheres (stars) at random positions in the sky:
          function addStars(numStars) {
  for (let i = 0; i < numStars; i++) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    // Random position in the upper sky
    const radius = 30 + Math.random() * 20;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI / 2;
    star.position.x = radius * Math.cos(theta) * Math.sin(phi);
    star.position.y = radius * Math.cos(phi) + 10;
    star.position.z = radius * Math.sin(theta) * Math.sin(phi);
    scene.add(star);
  }
}
addStars(100); // or however many stars you want




- **Response/Result:**
The sky looks like it's evening time  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 

  Need to fix the lightening

- **Iteration 8:**  
  - **Goal/Task/Rationale:**  
    Add a game clock and base the game end and sky on it.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}    
      Copilot Prompt:
      How would I go about making the sky based on a clock? I want this clock to display and start at 9pm. From 9pm-5am I want the moon to come out then go back down. From 5am-9pm I want the sun to come out then go back down. At 6pm, I want the clock to stop and end the game. I also want 1 minute in the clock to be 1 real life second, 1 hour be 1 real life minute.
      
      Response:
      Here’s how you can achieve this:
      Create a clock variable that tracks hours and minutes, starting at 9:00 PM.
      Display the clock on the screen using a simple HTML overlay.
      Advance the clock: Every real second, increment the minute; every 60 seconds, increment the hour.
      Change the sky and show sun/moon based on the time:
      9pm–5am: Show the moon, hide the sun, use a night sky color.
      5am–9pm: Show the sun, hide the moon, use a day sky color.
      At 6pm, stop the clock and end the game (e.g., show a message and stop updates).

      
- **Response/Result:**
  Night time from 9pm-5am then daytime from 5am till game ends.
  Clock runs from 9pm until 6pm (when game ends)
  



  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
  Done

- **Iteration 9:**  
  - **Goal/Task/Rationale:**  
  Add in a game start screen. Whenever the user presses any key, the screen goes away and the game starts.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      I added some html to the index.html file to show the screen. I also added some things in the main.js to pause the game whenever esc is pressed.
      
- **Response/Result:**
  Game pauses and don't start until a key is pressed at the start

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done

- **Iteration 10:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 


- **Iteration 11:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 



- **Iteration 12:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 


- **Iteration 13:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 




- **Iteration 14:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 



- **Iteration 15:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 



- **Iteration 16:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 



- **Iteration 17:**  
  - **Goal/Task/Rationale:**  
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      
      
- **Response/Result:**
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 

