package com.zendrive.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

public class DirectoryIndexer {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Data
    @AllArgsConstructor
    static class IndexedFile {
        UUID id;
        String name;
        long size;
        String createdDate;
        String blobPath;
    }

    @Data
    @AllArgsConstructor
    static class IndexedDirectory {
        UUID id;
        String name;
        long size;
        long contentSize;
        String createdDate;
        UUID previous;
        List<UUID> children;
    }

    private static void generateIndexRecords(
      File directory,
      IndexedDirectory indexedDirectory,
      List<IndexedDirectory> indexedDirectories,
      List<IndexedFile> indexedFiles
    ) {
        File[] files = directory.listFiles();

        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    IndexedDirectory folder = new IndexedDirectory(
                      UUID.randomUUID(),
                      file.getName(),
                      file.getTotalSpace(),
                      file.lastModified(),
                      file.getAbsolutePath(),
                      indexedDirectory.id,
                      new ArrayList<>()
                    );

                    indexedDirectories.add(folder);
                    indexedDirectory.children.add(folder.id);

                    generateIndexRecords(file, folder, indexedDirectories, indexedFiles);
                } else {
                    IndexedFile indexedFile = new IndexedFile(
                      UUID.randomUUID(),
                      file.getName(),
                      file.getTotalSpace(),
                      dateFormat.format(new Date(file.lastModified())),
                      file.getAbsolutePath()
                    );

                    indexedDirectory.children.add(indexedFile.id);
                    indexedFiles.add(indexedFile);
                }
            }
        }

    }

    public static void main(String[] args) {
        File rootDirectory = new File("/Users/admin/Desktop/fagz/Semestar_VI/sdp/zencloud/zendrive-api");

        List<IndexedDirectory> indexedDirectories = new ArrayList<>();
        List<IndexedFile> indexedFiles = new ArrayList<>();

        IndexedDirectory root = new IndexedDirectory(
          UUID.randomUUID(),
          "root",
          0,
          0,
          "",
          null,
          new ArrayList<>()
        );

        // Recursively generate index records starting from the root directory
        generateIndexRecords(
          rootDirectory,
          root,
          indexedDirectories,
          indexedFiles
        );

        indexedDirectories.add(root);

        // Write index records to JSON file
        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        try (Writer writer = new FileWriter("index.json")) {
            gson.toJson(mergeArrays(indexedDirectories.toArray(), indexedFiles.toArray()), writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static Object[] mergeArrays(Object[] array1, Object[] array2) {
        Object[] mergedArray = new Object[array1.length + array2.length];
        System.arraycopy(array1, 0, mergedArray, 0, array1.length);
        System.arraycopy(array2, 0, mergedArray, array1.length, array2.length);
        return mergedArray;
    }
}
