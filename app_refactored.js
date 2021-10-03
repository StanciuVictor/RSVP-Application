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
  filterCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked; // TRUE if checked, FALSE if not
    const lis = ul.children; //  provides a reference to a collection of elements children
    if (isChecked) {
      //  Daca e bifat
      for (let i = 0; i < lis.length; i++) {
        //  Parcurg toata lista de invitati
        let li = lis[i];
        if (li.className === "responded") {
          //  Daca invitatul a bifat Confirmed
          li.style.display = ""; //  Nu face nimic
        } else {
          //  Altfel
          li.style.display = "none"; //  Ascunde invitatul
        }
      }
    } else {
      //  Daca nu e bifat, afiez toti invitatii
      for (let i = 0; i < lis.length; i++) {
        let li = lis[i];
        li.style.display = "";
      }
    }
  });

  //  Creating <li> elements with names, checkbox, edit button and remove button
  function createLI(text) {
    //  Creates specified element with specified property and value
    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    }
    //  Creates element and appends it to the <li>
    function appendToLI(elementName, property, value){
      const element = createElement(elementName, property, value);
      li.appendChild(element);
      return element;
    }

    const li = document.createElement("li");

    //  Practic modific TEXT ELEMENT (reprezentat de numele invitatului)
    //  in HTML ELEMENT (reprezentat de <span> care la randul lui are TEXT ELEMENT)
    appendToLI("span", "textContent", text);
/*
    const label = appendToLI("label", 'textContent', 'Confirmed');
    const checkbox = createElement("input", 'type', 'checkbox');
    label.appendChild(checkbox);
    ******REFACTORED BELOW******
*/
    appendToLI("label", 'textContent', 'Confirmed')
        .appendChild(createElement("input", 'type', 'checkbox'));
        
    appendToLI("button", 'textContent', 'Edit');
    appendToLI("button", 'textContent', 'Remove');

    return li;
  }

  //  Registering Names
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = "";
    const li = createLI(text);
    ul.appendChild(li);
  });

  //  Checkbox
  ul.addEventListener("change", (e) => {
    const checkbox = e.target;
    const checked = checkbox.checked; // TRUE if checked, FALSE if not
    const listItem = checkbox.parentNode.parentNode;

    if (checked) {
      listItem.className = "responded";
    } else {
      listItem.className = "";
    }
  });

  //  Removing, Editing or Saving Names
  ul.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      
      const nameActions = {
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
      /*
        action will only be one of this 3 posible strings: remove, edit, save
        in the IF, action is compared to each possible string, so when a match is
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
