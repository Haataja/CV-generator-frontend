import English from './lang_en';
import Finnish from './lang_fi';

const locale = {
  GLOBAL_ID: "global_language_id",
  GLOBAL_LANGUAGE: "global_language",

  RIBBON_EDITOR: "ribbon_item_editor",
  RIBBON_TIMELINE: "ribbon_item_timeline",

  EDITOR_DIALOG_TITLE: "editor_dialog_{0}_title",
  EDITOR_DIALOG_EMPTY: "editor_dialog_empty_content",

  EDITOR_FIELD_FIRST_NAME: "editor_field_first_name_text",
  EDITOR_FIELD_LAST_NAME: "editor_field_last_name_text",
  EDITOR_FIELD_ADDRESS: "editor_field_address_text",
  EDITOR_FIELD_ZIP_CODE: "editor_field_zip_code_text",
  EDITOR_FIELD_CITY: "editor_field_city_text",
  EDITOR_FIELD_EMAIL: "editor_field_email_text",
  EDITOR_FIELD_PHONE: "editor_field_phone_text",

  TIMELINE_SHOW_WORK: "timeline_setting_show_work",
  TIMELINE_HIDE_WORK: "timeline_setting_hide_work",
  TIMELINE_SHOW_EDUCATION: "timeline_setting_show_education",
  TIMELINE_HIDE_EDUCATION: "timeline_setting_hide_education",
  TIMELINE_SHOW_PROJECTS: "timeline_setting_show_projects",
  TIMELINE_HIDE_PROJECTS: "timeline_setting_hide_projects",

  GLOBAL_SAVE_CHANGES: "global_action_save_changes",
  GLOBAL_CLOSE: "global_action_close",

  // Language exports

  LANGUAGES: [
    English, Finnish
  ],

  DEFAULT_LANGUAGE: English,

  // Function exports

  getLocalizedString: getLocalizedString,
  getKeyFormat: getKeyFormat
};

function getStringIfExists(value) {
  return typeof value === "string" ? value : "?";
}

function getLocalizedString(id) {
  for (let language of locale.LANGUAGES) {
    if (this === language[locale.GLOBAL_ID]) {
      return getStringIfExists(language[id]);
    }
  }

  return getStringIfExists(locale.DEFAULT_LANGUAGE[id]);
}

function getKeyFormat(id, ...args) {
  for (let key in args) {
    id = id.replace(`{${key}}`, args[key]);
  }

  return id;
}

export default locale;