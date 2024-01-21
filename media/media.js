const express = require("express");
const fs = require("fs");
const axios = require("axios");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const path = require("path");
const url = require("url");

const telnyx = require("telnyx")(process.env.TELNYX_API_KEY);

const uploadFile = async (filePath) => {};

const downloadFile = async (url) => {};

module.exports = { downloadFile, uploadFile };
