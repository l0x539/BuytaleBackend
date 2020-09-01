# Buytale BackEnd:

This the official Buytale backend source code, all rights reserved to [https://hytalehub.com](Hytale Hub LLC).

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

* Edit Profile:
	- `/profile`
		Method: `POST`.
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


