  import { songModel } from "../models/song.model.js";
  import id3 from "node-id3";
  import storageService from "../services/storage.service.js";

    async function uploadSong(req,res){
      
      const songBuffer = req.file.buffer;
    
      

      const tags= id3.read(songBuffer);
      console.log(tags.title);
      console.log(tags.image);
      
      const {mood} = req.body;

      const [songFile, posterFile] = await Promise.all([
        storageService.uploadFile({
          buffer: songBuffer,
          filename: tags.title + ".mp3",
          folder: "/cohort-2/moodify/songs"
        }),
        storageService.uploadFile({
          buffer: tags.image.imageBuffer,
          filename: tags.title + ".jpeg",
          folder: "/cohort-2/moodify/posters"
        })
      ]);


        const song = await songModel.create({
          title:tags.title,
          url:songFile.url,
          posterUrl:posterFile.url,
          mood
        })

        res.status(201).json({
          success:true,
          message:"Song uploaded successfully",
          song
        })

    }

 const getSong = async (req, res) => {
    try {
      const { mood } = req.query;
  
      const songs = await songModel.find(mood ? { mood } : {});
  
      res.status(200).json({
        message: "Songs fetched successfully",
        count: songs.length,
        songs,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };


  export  {
    uploadSong,
    getSong
  }


