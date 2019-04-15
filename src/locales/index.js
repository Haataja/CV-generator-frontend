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

  EDITOR_PROFILE_IMAGE_URL: "editor_image_url_help",

  EDITOR_BIO_HELP: "editor_bio_help_text",

  EDITOR_EXPERIENCE_EMPLOEYER: "editor_experience_employer",
  EDITOR_EXPERIENCE_TITLE: "editor_experience_title",
  EDITOR_EXPERIENCE_DESCRIPTION: "editor_experience_description",

  EDITOR_EDUCATION_SCHOOL_NAME: "editor_education_school_name",
  EDITOR_EDUCATION_SCHOOL_TYPE: "editor_education_school_type",
  EDITOR_EDUCATION_FIELD_NAME: "editor_education_field_name",
  EDITOR_EDUCATION_GRADE: "editor_education_grade",

  EDITOR_PROJECT_COMPLETION: "editor_education_completion_date",
  EDITOR_PROJECT_PROJECT_NAME: "editor_education_project_name",
  EDITOR_PROJECT_DESCRIPTION: "editor_education_description",

  EDITOR_TITLES_AWARDED: "editor_titles_awarded",
  EDITOR_TITLES_VALUE: "editor_titles_title",

  EDITOR_REFERENCES_EMAIL: "editor_references_email",
  EDITOR_REFERENCES_PHONE: "editor_references_phone",

  TIMELINE_SHOW_WORK: "timeline_setting_show_work",
  TIMELINE_HIDE_WORK: "timeline_setting_hide_work",
  TIMELINE_SHOW_EDUCATION: "timeline_setting_show_education",
  TIMELINE_HIDE_EDUCATION: "timeline_setting_hide_education",
  TIMELINE_SHOW_PROJECTS: "timeline_setting_show_projects",
  TIMELINE_HIDE_PROJECTS: "timeline_setting_hide_projects",

  ALERT_SUCCESS: "alert_success",
  ALERT_FAILURE: "alert_failure",
  ALERT_TEXT_FAILURE: "alert_text_failure",
  ALERT_TEXT_SUCCESS: "alert_text_success",
  ALERT_DISMISS: "alert_dismiss",

  GLOBAL_TOGGLE_LANGUAGE: "global_action_toggle_language",
  GLOBAL_SAVE_CHANGES: "global_action_save_changes",
  GLOBAL_CLOSE: "global_action_close",
  GLOBAL_UPDATE_INFORMATION: "global_action_update_information",
  GLOBAL_START_DATE: "global_action_start_date",
  GLOBAL_END_DATE: "global_action_end_date",
  GLOBAL_VISIBILITY_TITLE: "global_action_visibility_title",
  GLOBAL_VISIBILITY_VISIBLE: "global_action_visibility_visible",
  GLOBAL_VISIBILITY_HIDDEN: "global_action_visibility_hidden",
  GLOBAL_NAME: "global_action_name",
  GLOBAL_GRADE: "global_action_grade",
  GLOBAL_VALUE: "global_action_value",

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
