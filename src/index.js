const getRandomBoolean = () => Math.random() >= 0.5; // получить случайное true|false
const getRandomTimeout = () => Math.random() * 1000; // получить случайное время от 0 до 10 секунд

/*
Список статусов https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D0%BA%D0%BE%D0%B4%D0%BE%D0%B2_%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D1%8F_HTTP
нужно реазиловать 200 / 201 / 400/ 404 / 500 


onError - возвращает обьект в таком формате { status: 404, message: String }

onSuccess - возвращает обьект в таком формате { status: 200, message: Any }

any - любой тип данных

*/
const timeout = getRandomTimeout();
const randomBooleam = getRandomBoolean();

class Request {
  constructor() {
    this.todos = [];
  }

  get(partLine, obj) {
    setTimeout(() => {
      if (
        (partLine === "/todos" && randomBooleam) ||
        (partLine === "/todos?filter=all" && randomBooleam)
      ) {
        obj.onSuccess({
          status: 200,
          data: this.todos
        });
      } else if (partLine === "/todos?filter=active" && randomBooleam) {
        obj.onSuccess({
          status: 201,
          data: this.todos.filter(todo => todo.completed === false)
        });
      } else if (partLine === "/todos?filter=completed" && randomBooleam) {
        obj.onSuccess({
          status: 200,
          data: this.todos.filter(todo => todo.completed === true)
        });
      } else {
        obj.onError({
          status: 404,
          message: `Not Found: ${partLine}`
        });
      }
    }, timeout);
  }

  post(partLine, obj) {
    obj.body.completed = false;
    setTimeout(() => {
      if (partLine === "/todos" && randomBooleam) {
        this.todos = [...this.todos, obj.body];
        obj.onSuccess({
          status: 201,
          message: `todo successfully created`
        });
      } else {
        obj.onError({
          status: 400,
          message: `Invalid request: ${partLine}`
        });
      }
    }, timeout);
  }

  put(partLine, obj) {
    setTimeout(() => {
      let x = partLine[partLine.length - 1];
      if (partLine && randomBooleam) {
        this.todos.map((todo, todoIndex) => {
          if (x === todoIndex) {
            return { ...todo, ...obj.body };
          }
          return todo;
        });
        obj.onSuccess({
          status: 200,
          message: `todo successfully updated`
        });
      } else {
        obj.onError({
          status: 500,
          message: `Internal Server Error`
        });
      }
    }, timeout);
  }

  delete(partLine, obj) {
    setTimeout(() => {
      let i = partLine[partLine.length - 1];
      if (partLine && randomBooleam) {
        this.todos.filter((_, todoIndex) => i !== todoIndex);
        obj.onSuccess({
          status: 200,
          message: `todo successfully deleted`
        });
      } else {
        obj.onError({
          status: 404,
          message: `Error: index ${i} not found`
        });
      }
    }, timeout);
  }
}

const request = new Request();

// // запросить todos
request.get("/todos", {
  onSuccess: response => {
    console.log(response); // массив todos
  },
  onError: error => {
    console.log(error); // не верный url, например todoc
  }
});

// фильтрованные todos
// request.get("/todos?filter=active", {
//   onSuccess: response => {
//     console.log(response); // массив todos
//   },
//   onError: error => {
//     console.log(error); // не верный url, например todoc
//   }
// });
// request.get("/todos?filter=completed", {
//   onSuccess: response => {
//     console.log(response); // массив todos
//   },
//   onError: error => {
//     console.log(error); // не верный url, например todoc
//   }
// });

// Создание todo
// request.post("/todos", {
//   body: {
//     title: "New todo",
//     description: "Some text"
//   },
//   onSuccess: response => {
//     console.log(response); // todo успешно создан
//   },
//   onError: error => {
//     console.log(error); // не верный url, например todoc
//   }
// });
// request.post("/todos", {
//   body: {
//     title: "Second todo",
//     description: "text text"
//   },
//   onSuccess: response => {
//     console.log(response); // todo успешно создан
//   },
//   onError: error => {
//     console.log(error); // не верный url, например todoc
//   }
// });
// request.post("/todos", {
//   body: {
//     title: "Third todo",
//     description: "texttext"
//   },
//   onSuccess: response => {
//     console.log(response); // todo успешно создан
//   },
//   onError: error => {
//     console.log(error); // не верный url, например todoc
//   }
// });

//обновление todo
// request.put("/todos/0", {
//   body: {
//     title: "Testttt"
//   },
//   onSuccess: response => {
//     console.log(response); // todo успешно обновлен
//   },
//   onError: error => {
//     console.log(error); // не верный url, например todoc
//   }
// });

// удаление todo
// request.delete("/todos/0", {
//   onSuccess: response => {
//     console.log(response); // todo успешно удален
//   },
//   onError: error => {
//     console.log(error); // не верный url, например todoc или нет записи под index = 1
//   }
// });
