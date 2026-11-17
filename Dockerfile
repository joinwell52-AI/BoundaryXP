FROM public.ecr.aws/docker/library/node:24.19.0-bookworm-slim@sha256:e5a8dee7bc1e6a215d224a7ef8206f7e77271bc3cabd5febf2beafac0674f174 AS install
WORKDIR /app
# Download only the published compiled package. No private source or local data.
ADD https://registry.npmjs.org/boundaryxp-mcp/-/boundaryxp-mcp-0.4.0-rc.10-linux.1.tgz /tmp/bxp/package.tgz
RUN echo 'b878bd9ae366c79c9f9d8ced12241274f6163351f0cecf56f3efa31f26b96dbe  /tmp/bxp/package.tgz' | sha256sum -c - \
 && tar -xzf /tmp/bxp/package.tgz --strip-components=1 -C /app \
 && npm ci --ignore-scripts --omit=dev --no-audit --no-fund \
 && node --input-type=module -e "import {materializeNpmAssets,verifyPackage} from './installation.mjs'; materializeNpmAssets(process.cwd()); verifyPackage(process.cwd());" \
 && node --input-type=module -e "import {identity} from './runtime/native/loader.mjs'; if(identity().baseline!=='B-335')throw Error('CORE_IDENTITY');" \
 && rm -rf /tmp/bxp /root/.npm

FROM public.ecr.aws/docker/library/node:24.19.0-bookworm-slim@sha256:e5a8dee7bc1e6a215d224a7ef8206f7e77271bc3cabd5febf2beafac0674f174
LABEL org.opencontainers.image.title="BoundaryXP MCP Linux" \
      org.opencontainers.image.version="0.4.0-rc.10-linux.1" \
      org.opencontainers.image.source="https://github.com/joinwell52-AI/BoundaryXP" \
      org.opencontainers.image.licenses="MIT"
ENV NODE_ENV=production BOUNDARYXP_BROKER_MODE=foreground
WORKDIR /app
COPY --from=install --chown=node:node /app/ /app/
RUN mkdir /data && chown node:node /data
USER node
ENTRYPOINT ["node", "/app/server.mjs"]
CMD ["--data-root", "/data"]
