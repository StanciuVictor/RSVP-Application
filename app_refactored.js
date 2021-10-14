document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrar");
  const input = form.querySelector("input");

  const mainDiv = document.querySelector(".main");
  const ul = document.getElementById("invitedList");

  const div = document.createElement("div");
  const filterLabel = document.createElement("label");
  const filterCheckbox = document.createElement("input");

  filterLabel.textContent = "Hide those who haven't confirmed";
  filterCheckbox.type = "checkbox";
  div.appendChild(filterLabel);
  div.appendChild(filterCheckbox);
  mainDiv.insertBefore(div, ul);

  // Hide those who haven't responded
  filterCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;               // TRUE if checked, FALSE if not
    const lis = ul.children;                          // Provides a reference to a collection of elements children
    if (isChecked) {
      // If checked
      for (let i = 0; i < lis.length; i++) {
        // Go through invitees list
        let li = lis[i];
        let confirmLabel = li.getElementsByTagName('label')[0];
        if (li.className === "responded") {
          // If invitee is confirmed
          li.style.display = "";                      // Do nothing
          confirmLabel.style.display = 'none';        // Hide label with checkbox
        } else {
          li.style.display = "none";                  // Hide invitee
        }
      }
    } else {
      // If not checked, display all invitees
      for (let i = 0; i < lis.length; i++) {
        let li = lis[i];
        let confirmLabel = li.getElementsByTagName('label')[0];
        li.style.display = "";
        confirmLabel.style.display = '';              // Show label with checkbox
      }
    }
  });

  // Creates <li> elements with names, checkbox, edit button and remove button
  function createLI(text) {
    // Creates specified element with specified property and value
    function createNewElement(elementName, property, value) {
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    }
    // Creates element and appends it to the <li>
    function appendToLI(elementName, property, value) {
      const element = createNewElement(elementName, property, value);
      li.appendChild(element);
      return element;
    }

    const li = document.createElement("li");

    // To be able to modify the invitee name (text node) easily, insert it into
    //    a <span> tag.
    appendToLI("span", "textContent", text);
    /*
    ******REFACTORED BELOW******
    const label = appendToLI("label", 'textContent', 'Confirmed');
    const checkbox = createElement("input", 'type', 'checkbox');
    label.appendChild(checkbox);
    */
    appendToLI("label", 'textContent', 'Confirm')
      .appendChild(createNewElement("input", 'type', 'checkbox'));

    appendToLI("button", 'textContent', 'Edit');
    appendToLI("button", 'textContent', 'Remove');

    return li;
  }

  // Registering Names
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newInvitee = input.value;

    if (!newInvitee || !isNaN(newInvitee)) {          // If no name has been written (If newInvitee = '')
      alert('Please type the name of the person you would like to invite!');
      input.value = "";                               // Reset the text to '' after submitting
      return;                                         // Exit the handler
    } else {                                          
      const lis = ul.children;                        // Select all present <li> tags
      for (let i = 0; i < lis.length; i++) {
        const alreadyInvited = lis[i].firstElementChild.textContent;  // Get names of already invited people
        if (newInvitee === alreadyInvited) {          // If the name already exists in the array
          alert(`${newInvitee} has already been invited!`);
          input.value = "";                           // Reset the text to '' after submitting
          return;                                     // Exit the handler
        }
      }
    }

    // If the invitee name is not duplicate or null
    input.value = "";                                 // Reset the text to '' after submitting
    const li = createLI(newInvitee);
    ul.appendChild(li);
  });

  // Conform Checkbox
  ul.addEventListener("change", (e) => {
    const checkbox = e.target;
    const checked = checkbox.checked;                 // TRUE if checked, FALSE if not
    const listItem = checkbox.parentNode.parentNode;
    const label = checkbox.parentNode;
    const textNode = label.childNodes[0];             // Select the text node containing

    if (checked) {
      listItem.className = "responded";
      textNode.data = 'Confirmed';                    // Change text in label
    } else {
      listItem.className = "";
      textNode.data = 'Confirm';                      // Change text in label
    }
  });

  // Removing, Editing or Saving Names
  ul.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      const nameActions = {   // Object containing possible actions
        Remove: () => {
          ul.removeChild(li);
        },
        Edit: () => {
          const span = li.firstElementChild;
          const input = document.createElement("input");
          input.type = "text";
          input.value = span.textContent;
          li.insertBefore(input, span);
          li.removeChild(span);
          button.textContent = "Save";
        },
        Save: () => {
          const input = li.firstElementChild;
          const span = document.createElement("span");
          span.textContent = input.value;
          li.insertBefore(span, input);
          li.removeChild(input);
          button.textContent = "Edit";
        }
      };
      const action = button.textContent;  // This can be moved up above nameActions object, with the other declarations
      nameActions[action]();              // This replaces all IF ELSE from below
      /*           ^^^^
      action will only be one of this 3 posible strings: remove, edit, save.
      In the IF, action is compared to each possible string, so when a match is
      found, that same word will be used to run the branch.
      In the line above, the string in action will be used to acces the function
      directly from the object. Then the function will be executed.

      This works and it's a better aproach because the name of the buttons
      match the name of the nameActions properties.
      */

      // if (action === "Remove") {
      //   nameActions.remove();
      // } else if (action === "Edit") {
      //   nameActions.edit();
      // } else if (action === "Save") {
      //   nameActions.save();
      // }
    }
  });

  // Local Storage section starts here ##############################################################################################

  // If local storage is supported, use it
  if ('localStorage' in window && window.localStorage !== null) {

    /**
     * Retrieves string information about invitees from local storage and
     * transforms it into an array so that it will be easier to modify it
     * 
     * @returns {array} a multidimensional array containing arrays that each correspond to one invitee
     *                  OR an empty array if there are no invitees stored in local storage.
     */
    // Theese arrays contain info (HTML code) about each invitee.
    const getInviteesFromLocal = function () {
      const invitees = localStorage.getItem('invitees');  // is a string
      if (invitees) {
        return JSON.parse(invitees);  // transform string to array
      }
      return [];
    };

    /**
     * Recreates a <li> element based on information stored in local storage.
     * Each <li> represents one invitee.
     * The <li> element is then appended to the <ul> element.
     * 
     * @param {array} individualInfo - Array containing one element. The element is an HTML code corresponding to one invitee.
     */
    const addInviteeFromLocal = function (individualInfo) {
      const newLI = document.createElement('li');

      // Add to the <li> its children: span, label, buttons, etc.
      newLI.innerHTML = individualInfo[0];
      const confirmLabel = newLI.children[1];
      const checkbox = newLI.children[1].children[0];

      // If invitee was confirmed, modify the HTML code accordingly
      if (newLI.innerHTML.includes("Confirmed")) {
        newLI.className = 'responded';
        checkbox.checked = true;
      } else {
        newLI.className = '';
        checkbox.checked = false;
      }

      // Uncheck filter to display all invitees
      filterCheckbox.checked = false;

      // Display label of confirmation for every invitee
      confirmLabel.style.display = '';

      ul.appendChild(newLI);
    };

    // After page is loaded
    window.addEventListener('load', (e) => {

      // Get multidimensional array of invitees' info from local storage
      const inviteesArrFromLocal = getInviteesFromLocal();

      // Add each array of invitee's info (HTML code) to the <ul>
      inviteesArrFromLocal.forEach(individualInfo => {
        addInviteeFromLocal(individualInfo);
      });
    });

    // Save invitees to local storage before closing the web page
    window.addEventListener('beforeunload', (e) => {
      const savedInviteesArr = [];
      const inviteesLiTags = ul.children;             // HTMLCollection => must be transformed into an array
      // inviteesLiTags contain children elements as <span>, <button>, etc
      [...inviteesLiTags].forEach(element => {        // [...element] generates an array

        // Get the html inside the <li> element, meaning the invitee info and store it in an array
        const individualInfo = [element.innerHTML];

        // Save the array containing invitee info to a multidimensional array
        // "An array off arrays that contain info for each individual"
        savedInviteesArr.push(individualInfo);
      });
      localStorage.setItem('invitees', JSON.stringify(savedInviteesArr));
    });
  }


  // Local Storage

  // // Returns an array of all invitees from localStorage, or an empty array if there are no invitees
  // function getInvitees(){
  //   const invitees = localStorage.getItem('invitees');  // is a string
  //   if(invitees){
  //     return JSON.parse(invitees);  // transform string to array
  //   }
  //   return [];
  // }

  // function addInvitee(name){
  //   const invitees = getInvitees(); // get array of invitees from localStorage
  //   invitees.push(name);
  //   localStorage.setItem('invitees', JSON.stringify(invitees));
  // }

  // function removeInvitee(inviteeName){
  //   const invitees = getInvitees(); // get array of invitees from localStorage
  //   const inviteeIndex = invitees.indexOf(inviteeName);
  //   invitees.splice(inviteeIndex, 1); // Delete name at the index
  //   localStorage.setItem('invitees', JSON.stringify(invitees));
  // }

  // function displayInvitees(){
  //   const invitees = getInvitees(); // get array of invitees from localStorage
  //   invitees.forEach(person => {    // display each of them in a <li> inside the <ul>
  //     const li = createLI(person);
  //     ul.appendChild(li);
  //   });
  // }

  // if ('localStorage' in window && window.localStorage !== null) {
  //   displayInvitees();
  // }

});
