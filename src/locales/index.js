import English from './lang_en';
import Finnish from './lang_fi';

const locale = {
  GLOBAL_ID: "global_language_id",
  GLOBAL_LANGUAGE_ISO: "global_language_iso",
  GLOBAL_LANGUAGE: "global_language",

  RIBBON_MENU_EDITOR: "ribbon_menu_editor",
  RIBBON_EDIT_DOCUMENT: "ribbon_menu_item_editor",
  RIBBON_PUBLISH_DOCUMENT: "ribbon_menu_item_publish",
  RIBBON_MENU_TIMELINE: "ribbon_menu_timeline",

  EDITOR_GENERIC_TEXT: "editor_generic_{0}_text",
  EDITOR_FIELD_TEXT: "editor_field_{0}_text",

  TIMELINE_SHOW_WORK: "timeline_setting_show_work",
  TIMELINE_HIDE_WORK: "timeline_setting_hide_work",
  TIMELINE_SHOW_EDUCATION: "timeline_setting_show_education",
  TIMELINE_HIDE_EDUCATION: "timeline_setting_hide_education",
  TIMELINE_SHOW_PROJECTS: "timeline_setting_show_projects",
  TIMELINE_HIDE_PROJECTS: "timeline_setting_hide_projects",

  GLOBAL_TOGGLE_LANGUAGE: "global_action_toggle_language",
  GLOBAL_SAVE_CHANGES: "global_action_save_changes",
  GLOBAL_CLOSE: "global_action_close",

  // Language exports

  LANGUAGES: [
    English, Finnish
  ],

  DEFAULT_LANGUAGE: English,

  // Function exports

  getLocalizedString: getLocalizedString,
  getNeighbourLanguage: getNeighbourLanguage,
  getKeyFormat: getKeyFormat
};

function getStringIfExists(value, defaultValue) {
  /*if (defaultValue !== locale.GLOBAL_LANGUAGE_ISO) {
    return defaultValue;
  }*/

  return typeof value === "string" ? value : defaultValue;
}

function getLocalizedString(id) {
  for (let language of locale.LANGUAGES) {
    if (this === language[locale.GLOBAL_ID]) {
      return getStringIfExists(language[id], id);
    }
  }

  return getStringIfExists(locale.DEFAULT_LANGUAGE[id], id);
}

function getLanguageIndex(language_id) {
  for (let i = 0; i < locale.LANGUAGES.length; i++) {
    if (locale.LANGUAGES[i][locale.GLOBAL_ID] === language_id) {
      return i;
    }
  }

  return -1;
}

function getNeighbourLanguage(language, identifier) {
  let index = getLanguageIndex(language);

  if (index !== -1) {
    index = (index + 1) % locale.LANGUAGES.length;

    return locale.LANGUAGES[index][identifier];
  }

  return getNeighbourLanguage(locale.DEFAULT_LANGUAGE[locale.GLOBAL_ID], identifier);
}

function getKeyFormat(id, ...args) {
  for (let key in args) {
    id = id.replace(`{${key}}`, args[key]);
  }

  return id;
}

export default locale;
