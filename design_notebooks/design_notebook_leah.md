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
  Leah Price
#### **Project/Assignment:**
  Project 2
##### **Problem/Task:**
  Create a game
##### **Development Log**

- **Iteration 1:**  
  - **Goal/Task/Rationale:**  
  I wanted to add a day night cycle.
  
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
    "I want to do lighting, I want the game to start at night time, change to daytime at around 5 am and end at 6 pm. I want there to be a moon in the sky and lighting accordingly."
      
      
- **Response/Result:**
ChatGPT added lighting and a moon and sun moving across the sky, as the timer progresses.
  

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done! Maybe improve later.



- **Iteration 2:**  
  - **Goal/Task/Rationale:**  
  Change game time to be faster, it was moving a little slowly.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
    "Can you change the game time to be 1 minute real time = 2 hours game time."
      
- **Response/Result:**
  ChatGPT change the game time to speed up a bit.

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done!

- **Iteration 3:**  
  - **Goal/Task/Rationale:**  
  I wanted to add 11 items around the map.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
    "I want 11 items hidden randomly around the map, I already have the png files for them in a seperate folder."
      
      
- **Response/Result:**
  The pngs seem to show up around the map and after a little bit of debugging they spawned in correctly.

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done!

- **Iteration 4:**  
  - **Goal/Task/Rationale:**  
  I want to make a workable inventory and incorporate the items around the map into it.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
      "I want to make it so when you walk across the items (pngs) they despawn and the inventory increments by one"
      
- **Response/Result:**
  After walking over the items/pngs, they disappear and the inventory increments by one.

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done!

- **Iteration 5:**  
  - **Goal/Task/Rationale:**  
  I want the camera position to be changable by holding down on the right mouse button and having the mushroom's center be the direction of the walking.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
    "I want the camera to be moveable by holding down the right mouse button and the mushroom to walk in which ever way is relative to the camera."
      
- **Response/Result:**
  The camera became responsive to the right mouse button and holding down W makes it walk in the direction of the camera.

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done!

- **Iteration 6:**  
  - **Goal/Task/Rationale:**  
  I wanted the flashlight item to be directly in front of the mushroom as soon as the game started instead of being randomly placed around the map like the other items. This is because the flashlight is a good source of light for the player and flashlights are frequently one of the first items you find in games traditionally.
      
  - **What do you do?**   
    {If you ask AI, provide your prompt and link. If you fix it yourself, describe how you do it.}  
    "I want the flashlight to be directly in front of the mushroom as soon as the game starts unlike the other items which are randomly spawned."
      
- **Response/Result:**
  The flashlight became a static item that was seprate from the others, staying in one position every restart.

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done!


- **Iteration 7:**  
  - **Goal/Task/Rationale:**  
  I want the flashlight to emmit a point light when added to the inventory.
      
  - **What do you do?**   
    "Can you make it so a point light is coming from the mushrooms front center when the flashlight is added to the inventory?"
      
- **Response/Result:**
  A point light now emmits from the mushroom after it is added to the inventory.

  

- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done!

- **Iteration 8:**  
  - **Goal/Task/Rationale:**  
  I want to change it so the items don't just disappear when the mushroom walks onto them but I want it to be that the player has to press the space bar.
      
  - **What do you do?**   
    "Can you make it so the player has to press the space bar when an item is in close proximity to pick it up and add it to the inventory?"
      
- **Response/Result:**
  When a player is in close proximity to an item, they're prompted to pick it up and it gets added to the inventory if they do.


- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done!

- **Iteration 9:**  
  - **Goal/Task/Rationale:**  
  I want to make it so none of the items spawn into the trees or other objects to avoid bugs.
      
  - **What do you do?**   
    "Please make it so none of the items are able to spawn within the trees."
      
- **Response/Result:**
  The trees were added to a list that keeps their locations and the items are only added to locations the trees aren't.


- **Your Evaluation:** {Issues/errors/your decision:done/discard/revise prompt} 
Done!
