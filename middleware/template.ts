export default (note: any, fullname: String) => {
  var datex = new Date(note.date);
  var date = datex.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let tags = ""
  note.tags.map((e: any) => {
    tags += `<div>${e}</div>`
  }) 
  return `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${note.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Ubuntu', sans-serif;
    }

    body {
      padding: 25px 50px;
    }

    .title {
      font-size: 2rem;
    }

    .date {
      color: rgb(58, 58, 58);
    }

    .tags {
      display: flex;
    }

    .tags * {
      border-radius: 4px;
      font-size: 14px;
      padding: 3px 6px;
      margin-right: 10px;
      background: rgb(58, 58, 58);
      color: #fff;
    }

    .note-by {
      color: rgb(58, 58, 58);
    }

    .note-by-name {
      color: rgb(32, 32, 32);
      font-size: 1.2rem;
    }

    .des>* {
      margin: 5px 0;
    }

    .h-hr{
      margin-top: 10px;
      margin-bottom: 8px;
    }
  </style>
</head>

<body>
  <div class="des">
    <p class="title">${note.title}</p>
    <p class="date">${date}</p>
    <div class="tags">
    ${tags}
    </div>
    <div>
      <p class="note-by">Note By:</p>
      <p class="note-by-name">${fullname}</p>
    </div>
  </div>

  <hr class="h-hr" />

  ${note.html}

</body>

</html>
  `;
};
