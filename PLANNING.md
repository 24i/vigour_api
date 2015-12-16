# API

## Base API Class

#### `properties`

* `url`, endpoint location, must contain protocol too
* `method`, specify the HTTP method used in AJAX calls
* `headers`, list of headers to add in API calls, by default this is the list of headers sent:
  * Accept: application/json
  * Content-Type: application/json

### Auth APIs

#### login
Allow users to log in to a third party API

###### properties

* `username`
* `password`
* `facebook`

###### usage

```
// using username and password
login.set({username: 'yo', password: 'yo'})
// using facebook
login.facebook.val = true
```

#### verify
Allow token verification to check if request is authenticated

###### properties

* `token`

###### usage

```
// using username and password
verify.set({token: 'yo'})
```

#### register
Allow users to sign up using a third party API

###### properties

* `username`
* `password`
* `email`
* `userData`, JSON object, will change accordingly to specific implementations

###### usage

```
// using username and password
register.set({username: 'yo', password: 'yo', email: 'yo@yo.yo', userData: {
  gender: 'yo',
  age: 'yo'
}})
```

### TODO

facebook
email
network
password
mobile
user
purchase
receipt
url
player
price
operator
