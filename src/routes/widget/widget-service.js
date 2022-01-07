const WidgetService = {
  getAllWidgets(db, userId) {
    return db
      .from('widget')
      .select('*')
      .where('user_uid', userId)
      .orderBy('w_created_at');
  },
  getAllWidgetsByName(db, userId) {
    return db
      .from('widget')
      .select('*')
      .where('user_uid', userId)
      .orderBy('w_title', 'asc');
  },

  testId(id) {
    // Regular expression to check if string is a valid UUID
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    // String with valid UUID separated by dash
    const str = id; // example: 'a24a6ea4-ce75-4665-a070-57453082c256';

    return regexExp.test(str); // true or false
  },
  getSpecificWidget(db, id, userId) {
    const isIdValid = this.testId(id);
    if (!isIdValid) {
      return { error: 'This route is not accepted' };
    }
    console.log(isIdValid);
    const widget = db
      .from('widget')
      .select('*')
      .where('user_uid', userId)
      .where('w_uid', id)
      .first();

    return widget;
  },
  insertWidget(db, newWidget) {
    return db.insert(newWidget).into('widget').returning('*');
  },
  deleteWidget(db, id, userId) {
    return db.from('widget').where({ user_uid: userId, w_uid: id }).delete();
  },
  updateWidget(db, id, updates) {
    return db('widget').where('w_uid', id).update(updates).returning('*');
  },
};

module.exports = WidgetService;
