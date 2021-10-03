document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');

  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');

  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckbox = document.createElement('input');
  
  filterLabel.textContent = 'Hide those who haven\'t responded';
  filterCheckbox.type = 'checkbox';
  div.appendChild(filterLabel);
  div.appendChild(filterCheckbox);
  mainDiv.insertBefore(div,ul);
  filterCheckbox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;     // TRUE if checked, FALSE if not
    const lis = ul.children;                //  provides a reference to a collection of elements children
    if (isChecked) {                        //  Daca e bifat
      for(let i = 0; i < lis.length; i++){  //  Parcurg toata lista de invitati
        let li = lis[i];
        if (li.className === 'responded') { //  Daca invitatul a bifat Confirmed
          li.style.display = '';            //  Nu face nimic
        } else {                            //  Altfel
          li.style.display = 'none';        //  Ascunde invitatul
        }
      }
    } else {                                //  Daca nu e bifat, afiez toti invitatii
      for(let i = 0; i < lis.length; i++){
        let li = lis[i];
        li.style.display = '';
      }
    }
  });


  //  Creating <li> elements with names, checkbox, edit button and remove button
  function createLI(text) {
    const li = document.createElement('li');
    //  Practic modific TEXT ELEMENT (reprezentat de numele invitatului)
    //  in HTML ELEMENT (reprezentat de <span> care la randul lui are TEXT ELEMENT)
    const span = document.createElement('span');
    span.textContent = text;
    
    li.appendChild(span);

    const label = document.createElement('label');
    label.textContent = 'Confirmed';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    label.appendChild(checkbox);
    li.appendChild(label);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';

    li.appendChild(editButton); 

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';

    li.appendChild(removeButton);
    return li;
  }

  //  Registering Names
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = '';
    const li = createLI(text);
    ul.appendChild(li);
  });
    
  //  Checkbox
  ul.addEventListener('change', (e) => {
    const checkbox = e.target;
    const checked = checkbox.checked;   // TRUE if checked, FALSE if not
    const listItem = checkbox.parentNode.parentNode;
    
    if (checked) {
      listItem.className = 'responded';
    } else {
      listItem.className = '';
    }
  });

  //  Removing, Editing or Saving Names
  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;

      if(button.textContent === 'Remove'){
        ul.removeChild(li);
      } else if(button.textContent === 'Edit'){
        const span = li.firstElementChild;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        li.insertBefore(input, span);
        li.removeChild(span);
        button.textContent = 'Save';
      } else if (button.textContent === 'Save'){
        const input = li.firstElementChild;
        const span = document.createElement('span');
        span.textContent = input.value;
        li.insertBefore(span, input);
        li.removeChild(input);
        button.textContent = 'Edit';
      }
    }
  });
});
  
  
  
  
  
  
  
  
  