const openPopupButton = document.querySelector('.button_type_add');
const closePopupButton = document.querySelector('.button_type_close-popup');
const addNoteButton = document.querySelector('.button_type_submit-add-note');
const accountButton = document.querySelector('.account-info');

const form = document.querySelector('.form');
const titleInput = document.querySelector('.form__input_type_title');
const descriptionInput = document.querySelector('.form__input_type_description');

const popupTitle = document.querySelector('.popup__title');
const popupAddNote = document.querySelector('.popup-box_type_add-note');
const popupAccountInfo = document.querySelector('.account-info__details');
const popupReadNote = document.querySelector('.popup-box_type_read-note');
const popupReadTitle = document.querySelector('.popup__note-title');
const popupReadDescription = document.querySelector('.popup__note-text');
const popupReadDate = document.querySelector('.popup__note-date');
const popupReadNoteButton = document.querySelector('.button_type_close_note-popup');

const notesList = document.querySelector('.notes-list');
const noNote = document.querySelector('.no-note-info');
const noteMenu = document.querySelector('.note-settings__menu');

const searchInput = document.querySelector('.search-bar__input');

const notes = JSON.parse(localStorage.getItem('notes') || '[]');

const checkNotes = () => {
  if (notes.length === 0) {
    noNote.textContent = 'Здесь пока нет заметок.';
  } else {
    noNote.textContent = '';
    renderNotes(notes);
  }
}

const months = [
  'января', 'февраля', 'марта', 'апреля', 'мая',
  'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
]
let isEdited = false, editedId;

const openPopupAddNote = () => {
  popupAddNote.classList.add('popup_open');
}

const filterNotes = (e) => {
  const value = e.target.value.toLowerCase();
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(value) ||
    note.description.toLowerCase().includes(value)
  );
  if(filteredNotes.length === 0) {
    noNote.textContent = 'Ничего не найдено.';
    renderNotes(filteredNotes);
  } else {
    noNote.textContent = '';
    renderNotes(filteredNotes);
  }
}

searchInput.addEventListener('input', filterNotes);

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
  let noteDate = `${day} ${month} ${year}`;
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

const renderNotes = (arr) => {
  document.querySelectorAll('.note').forEach(note => note.remove());
  arr.forEach((note, index) => {
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

  checkNotes();
  closePopupAddNote();
}

const showMenu = (elem) => {
  elem.parentElement.lastElementChild.classList.toggle('note-settings__menu_open');
}

const deleteNote = (noteId) => {
  notes.splice(noteId, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes(notes);
  checkNotes();
}

const editNote = (noteId, title, description) => {
  isEdited = true;
  editedId = noteId;
  openPopupAddNote();
  titleInput.value = title;
  descriptionInput.value = description;
  popupTitle.textContent = 'Редактировать заметку';
}

const handleAccountInfoPopup = () => {
  popupAccountInfo.classList.toggle('popup_open');
}

accountButton.addEventListener('click', handleAccountInfoPopup);
openPopupButton.addEventListener('click', openPopupAddNote);
closePopupButton.addEventListener('click', closePopupAddNote);
popupReadNoteButton.addEventListener('click', closePopupReadNote);
addNoteButton.addEventListener('click', addNewNote);

checkNotes();
