// import { Injectable } from '@angular/core';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
// // import {
// //   getDownloadURL,
// //   ref,
// //   Storage,
// //   uploadBytes,
// // } from '@angular/fire/storage';

// import { finalize, from, map, Observable, switchMap } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ImageUploadService {
//   constructor(private storage: AngularFireStorage) {}

//   uploadImage(image: File, path: string): Observable<string> {
//     const storageRef = this.storage.ref(path);
//     const uploadTask = from(uploadBytes(storageRef, image));
//     return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
//   }
// }