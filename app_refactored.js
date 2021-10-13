document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrar");
  const input = form.querySelector("input");

  const mainDiv = document.querySelector(".main");
  const ul = document.getElementById("invitedList");

  const div = document.createElement("div");
  const filterLabel = document.createElement("label");
  const filterCheckbox = document.createElement("input");

  filterLabel.textContent = "Hide those who haven't responded";
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
    const label = appendToLI("label", 'textContent', 'Confirmed');
    const checkbox = createElement("input", 'type', 'checkbox');
    label.appendChild(checkbox);
    ******REFACTORED BELOW******
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
    } else {                                          // If the name already exists in the array
      const lis = ul.children;                        // Select all present <li> tags
      for (let i = 0; i < lis.length; i++) {
        const alreadyInvited = lis[i].firstElementChild.textContent;  // Get names of already invited people
        if (newInvitee === alreadyInvited) {
          alert(`${newInvitee} has already been invited!`);
          input.value = "";                           // Reset the text to '' after submitting
          return;                                     // Exit the handler
        }
      }
    }
    input.value = "";                                 // Reset the text to '' after submitting
    const li = createLI(newInvitee);
    ul.appendChild(li);
  });

  // Checkbox
  ul.addEventListener("change", (e) => {
    const checkbox = e.target;
    const checked = checkbox.checked;                 // TRUE if checked, FALSE if not
    const listItem = checkbox.parentNode.parentNode;
    const label = checkbox.parentNode;
    const textNode = label.childNodes[0];             // Select the text node containing

    if (checked) {
      listItem.className = "responded";
      textNode.data = 'Confirmed';                    // Change text
    } else {
      listItem.className = "";
      textNode.data = 'Confirm';                      // Change text
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
      nameActions[action]();              // This replaces all IF ELSE
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
});
