const todosInput = document.forms.todolist.todoinput // основное полле ввода 
const todoContainer = document.querySelector('.todos__list') // контейнер куда вставляем пунтк с делом
const buttonToggleActive = document.querySelector('.todos__button') // кнопка переключение активности чекбоксов
const buttonDeleteActiveItems = document.querySelector('.navigation__button-clear')
const numberList = document.querySelector('.navigation__numbers') // количество дел которое необходимо выполнить 
const todosLink = document.querySelectorAll('.navigation__link')// кнопки переключение видемых дел 
const navigationContainer = document.querySelector('.navigation')
const decor = document.querySelector('.decor')

// показывает или скрывает блок с делом
const offVisibil = (checkbox) => {
  checkbox.closest('.todos__item').setAttribute('style', 'display: none')
}
const onVisibil = (checkbox) => {
  checkbox.closest('.todos__item').removeAttribute('style', 'display: none')
}

// вывожу список дел в зависимости от статуса
const switchContent = (id) => {
  const todosList = todoContainer.querySelectorAll('.todos__item')
  const checkboxList = todoContainer.querySelectorAll('.todos__checkbox')
  if (id === 'All') {
    todosList.forEach((item) => {
      onVisibil(item)
    })
  }
  if (id === 'Active') {
    todosList.forEach((item) => {
      onVisibil(item)
    })
    checkboxList.forEach((item) => {
      if (item.checked === true) {
        offVisibil(item)
      }
    })
  }
  if (id === 'Completed') {
    todosList.forEach((item) => {
      onVisibil(item)
    })
    checkboxList.forEach((item,) => {
      if (item.checked === false) {
        offVisibil(item)
      }
    })
  }
}

// вешаю слушатели на ссылки навигации 
todosLink.forEach((item) => {
  item.addEventListener('click', (evt) => {
    evt.preventDefault()
    todosLink.forEach((itemClear) => {
      itemClear.classList.remove('link-active')
    })
    evt.target.classList.add('link-active')
    switchContent(evt.target.id)
  })
})

// вывожу кол-во активных дел
const getNumberItems = () => {
  const todosItems = Array.from(document.querySelectorAll('.todos__checkbox'))
  const i = todosItems.filter(item => item.checked === false)
  numberList.textContent = `${i.length} items left`
}

// скрываю или показываю кнопку очистки выполненых дел 
const activeButtonDeliteItem = () => {
  const todosItems = Array.from(document.querySelectorAll('.todos__checkbox'))
  const i = todosItems.filter(item => item.checked === true)
  if (i.length > 0) {
    buttonDeleteActiveItems.setAttribute(`style`, `opacity: 1; cursor: pointer;`)
  } else {
    buttonDeleteActiveItems.removeAttribute(`style`, `opacity: 1; cursor: pointer;`)
  }

}

// меняю состояние кнопки allCheckbox в зависимости от активных чекбоксов
const switchButtonActive = () => {
  const todosItems = Array.from(document.querySelectorAll('.todos__checkbox'))
  let i = 0
  todosItems.forEach((item) => {
    if (item.checked === true) {
      i += 1
    }
  })
  if (i === todosItems.length) {
    buttonToggleActive.classList.add('button__active')
  } else {
    buttonToggleActive.classList.remove('button__active')
  }
}

// меняю состояние текста и чекбокса 
const onCheckbox = (element) => {
  const todoText = element.closest('.todos__item').querySelector('.todos__text')
  todoText.classList.add('text-line')
  element.checked = true
}
const offCheckbox = (element) => {
  const todoText = element.closest('.todos__item').querySelector('.todos__text')
  todoText.classList.remove('text-line')
  element.checked = false
}

// получаю сохранёный объект с LocalStorage
const getLocalArray = () => {
  const localArrTodo = localStorage.getItem('todoList')
  const objLocalarr = JSON.parse(localArrTodo)
  if(objLocalarr !== null) {
  return objLocalarr
  } else {
    return []
  }
}

// меняю состояние всех чекбоксов локально 
const switchAllCheckedLocal = (boolen) => {
  const localArrTodo = getLocalArray()
  localArrTodo.forEach((item) => {
    item.checked = boolen
  })
  localStorage.setItem('todoList', JSON.stringify(localArrTodo))
}


// меняю состояние всех чекбоксов
const toggleAllChecked = () => {
  const todosItems = Array.from(document.querySelectorAll('.todos__checkbox'))
  let i = 0
  todosItems.forEach((item) => {
    if (item.checked === true) {
      i += 1
    }
  })
  if (i >= 0 && i !== todosItems.length) {
    todosItems.forEach((item) => {
      buttonToggleActive.classList.add('button__active')
      onCheckbox(item)
      switchAllCheckedLocal(true)
    })
  } else if (i === todosItems.length) {
    buttonToggleActive.classList.remove('button__active')
    todosItems.forEach((item) => {
      offCheckbox(item)
      switchAllCheckedLocal(false)
    })
  }
}

// генерирую готовый пункт списка дел



// проверяю наличие елементов дел
const checkingItems = () => {
  const todosItems = Array.from(document.querySelectorAll('.todos__checkbox'))
  if (todosItems.length > 0) {
    todosItems.forEach((item) => {
      if (item.checked) {
        onCheckbox(item)
      }
    })
    buttonToggleActive.setAttribute('style', 'opacity: 1; cursor: pointer;')
    navigationContainer.setAttribute('style', 'display: grid;')
    decor.setAttribute('style', 'display: block;')
  } else {
    decor.removeAttribute('style', 'display: block;')
    navigationContainer.removeAttribute('style', 'display: grid;')
    buttonToggleActive.removeAttribute('style', 'opacity: 1; cursor: pointer;')
  }
  activeButtonDeliteItem()
}
// удаляю все выполненые дела с локального объекта
const deleteAllCheckedLocal = () => {
  const localArrTodo = getLocalArray()
  localArrTodo.forEach((item, index) => {
    if (item.checked === true) {
      localArrTodo.splice(index, 1)
    }
  })
  localStorage.setItem('todoList', JSON.stringify(localArrTodo))
}

// слушатель кнопки удаление выполненых дел
buttonDeleteActiveItems.addEventListener('click', () => {
  const todosItems = Array.from(document.querySelectorAll('.todos__checkbox'))
  todosItems.forEach((item) => {
    if (item.checked === true) {
      const evtItem = item.closest('.todos__item')
      evtItem.remove()
    }
    deleteAllCheckedLocal()
    activeButtonDeliteItem()
    buttonToggleActive.classList.remove('button__active')
    checkingItems()
  })
})

buttonToggleActive.addEventListener('click', () => {
  toggleAllChecked()
  getNumberItems()
  activeButtonDeliteItem()
})


const createObj = (textValue) => {
  const localArrTodo = getLocalArray()
  const obj = {
    todoText: textValue,
    checked: false
  }
  localArrTodo.push(obj)
  return localArrTodo
}
// получаю сохранёный список дел и вставляю его в дом


// меняю состояние чекбокса в локальном масиве 
const editCheckedLocal = (index) => {
  const localArrTodo = getLocalArray()
  if (localArrTodo[index].checked === false) {
    localArrTodo[index].checked = true
  } else if (localArrTodo[index].checked === true) {
    localArrTodo[index].checked = false
  }
  localStorage.setItem('todoList', JSON.stringify(localArrTodo))
}
// удаляю пункт в локальном масиве 
const removeItemLocal = (index) => {
  const localArrTodo = getLocalArray()
  localArrTodo.splice(index, 1)
  localStorage.setItem('todoList', JSON.stringify(localArrTodo))
}
// меняю текст пункта в локальном масиве 
const editTextLocal = (text, index) => {
  const localArrTodo = getLocalArray()
  localArrTodo[index].todoText = text
  localArrTodo[index].checked = false
  localStorage.setItem('todoList', JSON.stringify(localArrTodo))
}

// create -item-edit-render
// получаю индексь елемента 
const getIndexElement = (evtTarget) => {
  let indexElement
  const listTodo = document.querySelectorAll('.todos__item')
  listTodo.forEach((item, index) => {
    if (item === evtTarget.closest('.todos__item')) {
      indexElement = index
    }
  })
  return indexElement
}

// слушатели пункта 

const generateEventListner = (element) => {
  element.querySelector('.todos__button-delete').addEventListener('click', (evt) => {// слушатель кнопки удаления пунктка дел
    removeItemLocal(getIndexElement(evt.target))
    element.remove()
    getNumberItems()
    checkingItems()
  })

  element.querySelector('.todos__checkbox').addEventListener('click', (evt) => { // слушатель изменение состояния чекбокса
    if (evt.target.checked === true) {
      onCheckbox(evt.target)
    } else {
      offCheckbox(evt.target)
    }
    editCheckedLocal(getIndexElement(evt.target))
    switchButtonActive()
    getNumberItems()
    activeButtonDeliteItem()
  })

  element.querySelector('.todos__text').addEventListener('dblclick', (evt) => { // слушатель изменения пункта дел
    editItemElement(evt.target)
  })
}

// собераю пункт списка дела

const generateItem = ({ text, checked = false }) => {
  const itemElement = document.querySelector('#item-temlate').content.querySelector('.todos__item').cloneNode(true)
  itemElement.querySelector('.todos__text').textContent = text
  itemElement.querySelector('.todos__checkbox').checked = checked
  generateEventListner(itemElement)

  return itemElement
}

// редактирую пункт
const editItemElement = (element) => {
  let textContent = element.textContent
  const container = element.closest('.todos__item')
  const childrenContainer = Array.from(element.closest('.todos__item').children)
  childrenContainer.forEach((item) => {
    item.remove()
  })
  // добавляю поле ввода текста 
  const inputElement = document.querySelector('#input-temlate').content.querySelector('.input').cloneNode(true);
  container.append(inputElement)
  inputElement.value = textContent
  inputElement.focus()

  const editElement = (evt) => {
    if (evt.target !== inputElement) {// функция удаления поля ввода и добавление изменнёного пункта дел
      inputElement.remove()
      container.before(generateItem({ text: textContent }))
      container.remove()
      document.removeEventListener('click', editElement)
    }
  }
  document.addEventListener('click', editElement)

  inputElement.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      editTextLocal(inputElement.value, getIndexElement(evt.target))
      textContent = inputElement.value
      inputElement.remove()
      container.before(generateItem({ text: textContent }))
      container.remove()
      document.removeEventListener('click', editElement)
      inputElement.addEventListener('keydown', (evt))
    }
  })
}

// наполняю лист дел пунктами из локал 
{
  const localArrTodo = getLocalArray()
  if (localArrTodo !== null) {
    localArrTodo.forEach((item) => {
      todoContainer.append(generateItem({ text: item.todoText, checked: item.checked }))
    })
  }
}
switchButtonActive()
checkingItems()
getNumberItems()

// слушатель Sabmite 
addEventListener('submit', (evt) => {
  evt.preventDefault()
  if (todosInput.value.trim().length > 0) {
    todoContainer.append(generateItem({ text: todosInput.value }))
    localStorage.setItem('todoList', JSON.stringify(createObj(todosInput.value)))
    getNumberItems()
    switchButtonActive()
    todosInput.value = ''
    checkingItems()
  }
})

