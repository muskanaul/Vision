//
//  Vibration.m
//  vision
//
//  Created by Jim Yang on 2019-09-14.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TouchFeedback, NSObject)
RCT_EXTERN_METHOD(vibrateHigh)
RCT_EXTERN_METHOD(vibrateMedium)
RCT_EXTERN_METHOD(vibrateLow)
@end

