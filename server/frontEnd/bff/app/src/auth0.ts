// import jwt from "jsonwebtoken";
// import jwksClient from "jwks-rsa";

// // https://github.com/auth0/node-jsonwebtoken
// // https://github.com/auth0/node-jwks-rsa
// const jwksUri = "https://dev-lr8vwbeyc7gmi0w2.us.auth0.com/.well-known/jwks.json"
// const audience = "read-every-word-bff-dev"
// const issuer = "https://dev-lr8vwbeyc7gmi0w2.us.auth0.com"

// // Set up the JWKS client
// const client = jwksClient({
//     jwksUri
// });

// // Helper function to retrieve signing key
// const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
//     client.getSigningKey(header.kid!, (err, key) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             const signingKey = key?.getPublicKey();
//             callback(null, signingKey);
//         }
//     });
// };

// // Function to validate the token
// const validateToken = (token: string) => {
//     const options = {
//         audience,
//         issuer,
//         algorithms: ["RS256"]
//     };

//     jwt.verify(token, getKey, options, (err, decoded) => {
//         if (err) {
//             console.error("Token validation failed:", err);
//         } else {
//             console.log("Token is valid:", decoded);
//         }
//     });
// };

// // Example usage
// const token = "<your-jwt-token>"; // Replace with the actual token
// validateToken(token);
