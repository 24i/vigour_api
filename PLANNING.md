# API

### Base API Class

###### properties

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
// listening for response
auth.login.on('data', function (token) {
  console.log(token)
})
// using username and password
auth.login.set({username: 'yo', password: 'yo'})
// using facebook
auth.login.facebook.val = true
```

#### verify
Allow token verification to check if request is authenticated

###### properties

* `token`

###### usage

```
// listen for data
auth.verify.on('data', (data) => {
  // data === true --> token valid
})
// verify the given token
auth.verify.set({token: 'yo'})
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
auth.register.set({
  username: 'yo',
  password: 'yo',
  email: 'yo@yo.yo',
  userData: {
    gender: 'yo',
    age: 'yo'
  }
})
```

#### resetPassword
Allow users to reset their password providing a new one

###### properties

* `new`

###### usage

```
auth.resetPassword.set({new: 'yo'})
```

#### sendPassword
Allow users to reset their password providing a new one

###### properties

* `email`

###### usage

```
auth.sendPassword.set({email: 'yo@yo.yo'})
```

#### userData
Retrieves used data for an authenticated user

###### properties

* `authToken`

###### usage

```
auth.userData.set({authToken: 'yo'})
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
