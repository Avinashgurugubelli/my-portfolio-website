// scripts/syncBlogAndBuild.mjs

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import axios from 'axios';
import { Octokit } from '@octokit/core';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const sdkVersions = require('./sdk-versions.json');

async function run() {
  const BLOG_VERSION = sdkVersions.blogs.version;
  const ARTIFACT_PREFIX = sdkVersions.blogs.artifactPrefix;
  const REPO = sdkVersions.blogs.repo;
  const TAG = `v${BLOG_VERSION}`;
  const ASSET_NAME = `${ARTIFACT_PREFIX}${BLOG_VERSION}.zip`;

  const DOWNLOAD_DIR = path.resolve('blog-temp');
  const unzipPath = path.join(DOWNLOAD_DIR, 'unzipped');
  const blogSource = path.join(unzipPath, 'out/blogs');
  const BLOGS_OUTPUT_DIR = path.resolve('dist/blogs');

  console.log(`\n📦 Blog Version: ${BLOG_VERSION}`);
  console.log(`📦 Prefix: ${ARTIFACT_PREFIX}`);
  console.log(`📦 Repo: ${REPO}`);

  if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = REPO.split('/');

  const release = await octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
    owner,
    repo,
    tag: TAG,
  });

  const asset = release.data.assets.find(a => a.name === ASSET_NAME);
  if (!asset) throw new Error(`Asset ${ASSET_NAME} not found in release ${TAG}`);

  const zipPath = path.join(DOWNLOAD_DIR, ASSET_NAME);
  const res = await axios.get(asset.browser_download_url, {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(zipPath);
  await new Promise((resolve, reject) => {
    res.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  await fs.createReadStream(zipPath).pipe(unzipper.Extract({ path: unzipPath })).promise();
  console.log(`✅ Unzipped to ${unzipPath}`);

  // // Step 1: Install dependencies - commented as we are running npn run build:app
  // console.log(`📦 Installing dependencies...`);
  // execSync('npm install', { stdio: 'inherit' });

  // // Step 2: Build the project - - commented as we are running npn run build:app
  // console.log(`🏗️  Building project...`);
  // execSync('npm run build', { stdio: 'inherit' });

  // Step 3: Copy blog files to dist/blogs/
  if (!fs.existsSync(BLOGS_OUTPUT_DIR)) {
    fs.mkdirSync(BLOGS_OUTPUT_DIR, { recursive: true });
  }

  console.log(`📂 Copying blog files from: ${blogSource} to ${BLOGS_OUTPUT_DIR}`);
  execSync(`cp -r "${blogSource}/." "${BLOGS_OUTPUT_DIR}/"`); // copy all contents into dist/blogs

  console.log(`✅ Blogs copied to ${BLOGS_OUTPUT_DIR}`);

  console.log(`📂 Contents of dist folder:`);
  execSync('ls -R dist', { stdio: 'inherit' });
}

run().catch(err => {
  console.error(`❌ Error:`, err.message);
  process.exit(1);
});
