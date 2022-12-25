const openPopupButton = document.querySelector('.button_type_add');
const closePopupButton = document.querySelector('.button_type_close-popup');
const addNoteButton = document.querySelector('.button_type_submit-add-note');

const form = document.querySelector('.form');
const titleInput = document.querySelector('.form__input_type_title');
const descriptionInput = document.querySelector('.form__input_type_description');

const popupTitle = document.querySelector('.popup__title');
const popupAddNote = document.querySelector('.popup-box_type_add-note');
const popupReadNote = document.querySelector('.popup-box_type_read-note');
const popupReadTitle = document.querySelector('.popup__note-title');
const popupReadDescription = document.querySelector('.popup__note-text');
const popupReadDate = document.querySelector('.popup__note-date');
const popupReadNoteButton = document.querySelector('.button_type_close_note-popup');

const notea = document.querySelectorAll('.note');
const notesList = document.querySelector('.notes-list');
const noteMenu = document.querySelector('.note-settings__menu');

const notes = JSON.parse(localStorage.getItem('notes') || '[]');
const months = [
  'January', 'February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September', 'October', 'November', 'December'
]
let isEdited = false, editedId;

const openPopupAddNote = () => {
  popupAddNote.classList.add('popup_open');
}

const openPopupReadNote = (title, description, date) => {
    popupReadNote.classList.add('popup_open');
    popupReadTitle.textContent = title;
    popupReadDescription.textContent = description;
    popupReadDate.textContent = date;
}

const closePopupAddNote = () => {
  isEdited = false;
  popupAddNote.classList.remove('popup_open');
  popupTitle.textContent = 'Add a New Note';
  form.reset();
}

const closePopupReadNote = () => {
  popupReadNote.classList.remove('popup_open');
}

const findNoteDate = () => {
  let dateObj = new Date();
  let month = months[dateObj.getMonth()];
  let day = dateObj.getDate();
  let year = dateObj.getFullYear();
  let noteDate = `${month} ${day}, ${year}`;
  return noteDate;
}

const createNote = (data, index) => {
  let liTag = ` <li class="note">
    <div class="note__details">
      <h2 class="note__title">${data.title}</h2>
      <p class="note__description">${data.description}</p>
    </div>
    <div class="note__bottom-content">
      <p class="note__date">${data.date}</p>
      <button onclick="showMenu(this)" class="button note-settings__button"></button>
      <div class="note-settings__menu">
          <button onclick="openPopupReadNote('${data.title}', '${data.description}', '${data.date}')" class="button note-settings-menu__button button_type_read"></button>
          <button onclick="editNote(${index}, '${data.title}', '${data.description}')" class="button note-settings-menu__button button_type_edit"></button>
          <button onclick="deleteNote(${index})" class="button note-settings-menu__button button_type_delete"></button>
      </div>
    </div>
  </li> `;

  return liTag;
}

const renderNotes = () => {
  document.querySelectorAll('.note').forEach(note => note.remove());
  notes.forEach((note, index) => {
    notesList.insertAdjacentHTML('afterbegin', createNote(note, index));
  });
}

const addNewNote = (e) => {
  e.preventDefault();
  let noteTitle = titleInput.value;
  let noteDescription = descriptionInput.value;

  let noteInfo = {
    title: noteTitle,
    description: noteDescription,
    date: findNoteDate()
  }

  if(!isEdited) {
    notes.push(noteInfo);
  } else {
    notes[editedId] = noteInfo;
  }

  localStorage.setItem('notes', JSON.stringify(notes));

  renderNotes();
  closePopupAddNote();
}

const showMenu = (elem) => {
  elem.parentElement.lastElementChild.classList.toggle('note-settings__menu_open');
}

const deleteNote = (noteId) => {
  notes.splice(noteId, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes();
}

const editNote = (noteId, title, description) => {
  isEdited = true;
  editedId = noteId;
  openPopupAddNote();
  titleInput.value = title;
  descriptionInput.value = description;
  popupTitle.textContent = 'Edit the Note';

}

openPopupButton.addEventListener('click', openPopupAddNote);
closePopupButton.addEventListener('click', closePopupAddNote);
popupReadNoteButton.addEventListener('click', closePopupReadNote);
addNoteButton.addEventListener('click', addNewNote);

renderNotes();
