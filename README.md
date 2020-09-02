# Buytale BackEnd:

This the official Buytale backend source code, all rights reserved to [Hytale Hub LLC](https://hytalehub.com).

## TITLE 1:

TBA

## API:

* All API requests under `/api/v1/` route.
* All `Content-Type` are in json => `application/json`

### Authenticating Users:

* Login:
	- `/login`:
		Method: `POST`.
		Params: 
```
{
	email     // * Required
	password  // * Required
	keepMe    // for keep me logged in checkbox.
}
```

Login a registered user.


* Register:
	- `/register`
		Method: `POST`.
		Params:
```
{
	firstname  // * Required
	lastname   // * Required
	email      // * Required
	password   // * Required
	terms      // * Required
}
```

Register a new user.

* Forgotten Password:
	- `/forget-password`
		Method: `POST`.
		Params:
```
{
	email // * Required
}
```

* Update Password:
	- `/update-password`
		Method: `PUT`
		Params:
```
{
	token     // +* Required if not registered, optional if registered
	password  // * Required
}
```

* Edit Profile:
	- `/profile`
		Method: `PUT`.
		Params:
```
{
	email         // + optional
	firstname     // + optional
	lastname      // + optional
	newpasswd     // + optional
	confirmpasswd // * Required
	expireallsess // + optional
}
```

## TBA
