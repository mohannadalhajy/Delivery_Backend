const SERVER_ERRORS = {
    //---------------------------------------------
    //Authentication Errors Start from 1000 t0 1999
    //---------------------------------------------
    USER_IS_ALREADY_EXIST: 1000,
  
    USER_NOT_REGISTERED: 1001,
  
    USER_IS_NOT_VERIFY: 1002,
  
    NOT_GENERATE_CODE: 1003,
  
    INVALID_CODE: 1004,
  
    OTP_IS_EXPIRED: 1005,
  
    INVALID_PASSWORD: 1006,
  
    ACCESS_TOKEN_IS_NOT_FOUND: 1007,
  
    ACCESS_TOKEN_INVALID: 1008, // invalid or expired
  
    ACCESS_TOKEN_IS_NOT_GENERATED: 1009,
  
    ERROR_IN_HASH_PASSWORD: 1010,
  
    ERROR_IN_COMPARE_PASSWORD: 1011,
  
    PASSWORD_AND_CONFIRM_PASSWORD_NOT_CORRECT: 1012,
  
    DO_NOT_SEND_MESSAGE: 1013,
  
    OLD_PASSWORD_IS_NOT_CORRECT: 1014,
  
    ROLE_NOT_FOUND: 1015,
  
    USER_NOT_AUTHORIZED: 1016,
    
    //---------------------------------------------
    // Users Errors Start from 2000 t0 2999
    //---------------------------------------------
    USER_IS_DELETED: 2000,
  
    //---------------------------------------------
    // Clients Errors Start from 3000 t0 3999
    //---------------------------------------------
    RECORDS_NOT_FOUND: 3000,
    RECORD_NOT_FOUND: 3001,
    RECORD_EMPTY: 3002,
    NAME_EMPTY: 3009,
    RECORD_IS_EXIST_ALREADY: 3018,
    RECORD_IS_NOT_VALID: 3019,
    COMPANY_NAME_EMPTY: 3003,
    USER_NAME_EMPTY : 3004,
    COMPANY_IS_EXIST_ALREADY: 3005,
    PASSWORD_EMPTY: 3006,
    AMOUNT_EMPTY: 3007,
    POINTS_EMPTY: 3008,
    EMIRATE_EMPTY: 3010,
    CITY_EMPTY: 3011,
    PHONE_EMPTY: 3012,
    COMPANY_TYPE_EMPTY : 3013,
    CONTRACT_DATE_EMPTY: 3014,
    SERVICE_START_DATE_EMPTY: 3015,
    SERVICE_END_DATE_EMPTY: 3016,
    AMOUNT_IS_NOT_VALID: 3020,  
    POINTS_IS_NOT_VALID: 3021,
    PHONE_NOT_VALID: 3022,
    LATITUDE__EMPTY: 3024,
    LONGITUDE__EMPTY: 3025,
    LATITUDE__IS_NOT_VALID: 3026,
    LONGITUDE__IS_NOT_VALID: 3027,
    PHONE_IS_EXIST_ALREADY:3028,
    CIVIL_ID_EMPTY:3029,
    CIVIL_ID_IS_EXIST_ALREADY:3030,

    //---------------------------------------------
    // Drivers Errors Start from 4000 t0 4999
    //---------------------------------------------
    //---------------------------------------------
    // Orders Errors Start from 5000 t0 5999
    //---------------------------------------------
  

    //---------------------------------------------
    // Orders Errors Start from 5000 t0 5999
    //---------------------------------------------

    //---------------------------------------------
    // Vehicles Errors Start from 6000 t0 6999
    //---------------------------------------------
    //---------------------------------------------
    // Users Errors Start from 3000 t0 3999
    //---------------------------------------------
    //---------------------------------------------
    // Invalid Id (Mongodb id)
    INVALID_ID: 11000,
  
    //---------------------------------------------
    //Link does not found
    LINK_NOT_FOUND: 12000,
  };
  
  module.exports = SERVER_ERRORS;