function User(id, first_name, last_name, profile_pic, locale, timezone, gender) {
	this.id = id;
	this.first_name = first_name;
	this.last_name = last_name;
	this.profile_pic = profile_pic;
	this.locale = locale;
	this.timezone = timezone;
	this.gender = gender;
}

module.exports = User;