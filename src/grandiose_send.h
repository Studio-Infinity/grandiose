#ifndef GRANDIOSE_SEND_H
#define GRANDIOSE_SEND_H

#include "node_api.h"
#include "grandiose_util.h"

napi_value send(napi_env env, napi_callback_info info);
napi_value videoSend(napi_env env, napi_callback_info info);

struct sendCarrier : carrier {
  char* name = nullptr;
  char* groups = nullptr;
  bool clockVideo = false;
  bool clockAudio = false;
  NDIlib_send_instance_t send;
  ~sendCarrier() {
    free(name);
  }
};

struct sendDataCarrier : carrier {
  NDIlib_send_instance_t send;
  NDIlib_video_frame_v2_t videoFrame;
  napi_ref sourceBufferRef = nullptr;
  ~sendDataCarrier() {
    // TODO: free sourceBufferRef
  }
};

#endif /* GRANDIOSE_SEND_H */