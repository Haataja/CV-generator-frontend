# Prerequisites

## Tools

[Download and install Node.js](https://nodejs.org/en/) (Latest stable version)

## Configure project

### Back-end

Make sure back-end is running during front-end development.
Front-end partially requires back-end integration.

### Dependencies

Before you can work with the front-end, you need to install its dependencies.
This can be done with following command from project root directory.

`npm install`

# Development configuration

Test data can be used during development, but it needs to be injected directly into the code.
Test data object can be injected at *src/components/DocumentView.js*.

In this method, you can override *defaultData* constant to provide following test data.

## Test data

```{
  "firstname": "Tuksu",
  "lastname": "Juksu",
  "contact_info": {
    "email": "tuksu.juksu@email.com",
    "phone": "0101234456",
    "visible": true
  },
  "address": {
    "street_address": "Esimerkkikatu 12",
    "zipcode": "33500",
    "country": "",
    "city": "Tampere",
    "visible": true
  },
  "profile_image": {
    "source": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
    "visible": true
  },
  "bio": {
    "value": "I'm absolutely the best. No one is better than me. Simply the best.",
    "footer": "",
    "visible": true
  },
  "misc": {
    "order": 6,
    "visible": true,
    "data": [
      {
        "type": "other",
        "id": 1,
        "visible": true,
        "value": "Mother-tongue",
        "name": "Finnish"
      },
      {
        "type": "other",
        "id": 2,
        "visible": true,
        "value": "Poor",
        "name": "English"
      }
    ]
  },
  "experience": {
    "order": 0,
    "visible": true,
    "data": [
      {
        "type": "work",
        "id": 1,
        "visible": true,
        "startdate": "2019-04-23",
        "enddate": "2019-04-23",
        "title": "Mestari koodari",
        "name": "Joonas koodipajaaa",
        "description": "Javascriptiä tehtiin niin maan pahuksen paljonaaaaa",
        "achievements": null
      },
      {
        "type": "work",
        "id": 2,
        "visible": true,
        "startdate": "2019-04-16",
        "enddate": "2019-04-16",
        "title": "Keskivertokoodari",
        "name": "HannaTec",
        "description": "Tuli tehtyä ihan O.K koodia!",
        "achievements": null
      },
      {
        "type": "work",
        "id": 3,
        "visible": true,
        "startdate": "1982-04-15",
        "enddate": "2011-04-15",
        "title": "Aloittelija koodarizzz",
        "name": "Samu pro Codezzz",
        "description": "Tuli tehtyä spagettiaZZZ",
        "achievements": null
      }
    ]
  },
  "education": {
    "order": 2,
    "visible": true,
    "data": [
      {
        "type": "education",
        "id": 1,
        "visible": true,
        "school_name": "Tampere University of Applied Sciences",
        "school_type": "University of Applied Sciences",
        "field_name": "Bacheleor of Business Information Systems",
        "grade": 4,
        "startdate": "2013-08-01",
        "enddate": "2017-12-20"
      },
      {
        "type": "education",
        "id": 2,
        "visible": true,
        "school_name": "Cool guy school",
        "school_type": "Korkeakoulu",
        "field_name": "Coolest of all dudes",
        "grade": 1,
        "startdate": "2019-04-16",
        "enddate": "2019-04-16"
      }
    ]
  },
  "projects": {
    "order": 3,
    "visible": true,
    "data": [
      {
        "type": "project",
        "id": 1,
        "visible": true,
        "name": "Java/json-parser",
        "description": "I worked on a json-parser, which can read and write json data. I worked in a group of ten people. Project was a great success (as Borat would say it) and it reached top 10 most downloaded json-parsers month it was released.",
        "completion_date": "2018-11-01"
      },
      {
        "type": "project",
        "id": 2,
        "visible": true,
        "name": "Java/shpoping-list-applcation",
        "description": "Shopping list application where user can save their data as a json file. User can also read their shopping list from said json file. User can also save their shopping list to Dropbox and database. Standalone project, worked for 8 hours for ten months.",
        "completion_date": "2011-12-12"
      },
      {
        "type": "project",
        "id": 3,
        "visible": true,
        "name": "Kotlin/user-login-backend",
        "description": "User login backend for Samu's pro codezz. Worked with two other people on this project. My field of work was mostly releted on validating user's login credentials.",
        "completion_date": "2006-01-01"
      },
      {
        "type": "achievement",
        "id": 4,
        "visible": true,
        "name": "Award for best Kotlin code in 2015",
        "description": "I was awarded from my hard work with Ktolin",
        "completion_date": "2014-05-25"
      }
    ]
  },
  "titles": {
    "order": 4,
    "visible": true,
    "data": [
      {
        "type": "title",
        "id": 1,
        "visible": true,
        "title": "Penkkauksen maisterikoulutus",
        "awarded": "2013-01-01"
      },
      {
        "type": "title",
        "id": 2,
        "visible": true,
        "title": "Kauneimmat hiukset",
        "awarded": "2019-04-18"
      },
      {
        "type": "title",
        "id": 3,
        "visible": true,
        "title": "Komein hauis 2019",
        "awarded": "2019-04-15"
      }
    ]
  },
  "references": {
    "order": 5,
    "visible": true,
    "data": [
      {
        "type": "person",
        "id": 1,
        "visible": true,
        "name": "Saul Goodman",
        "contact_email": "sauli.hyvamies@gmail.com",
        "contact_phone": "04012321312"
      },
      {
        "type": "person",
        "id": 2,
        "visible": true,
        "name": "Valtteri Valkoinen",
        "contact_email": "valtteri@pahaksirikkoutuminen.com",
        "contact_phone": "0407965655"
      }
    ]
  }
}```

# Creating production build

Building the project will create separate directory in project folder called *build*.
To start building, provide this command in project directory.

`npm run build`

## Integration with back-end

Copy all production files (from *build*) to back-end (*src/main/resources/static*).
