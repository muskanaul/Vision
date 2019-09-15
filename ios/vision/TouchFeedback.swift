//
//  Vibration.swift
//  vibrationTest
//
//  Created by Jim Yang on 2019-09-14.
//  Copyright © 2019 Jim Yang. All rights reserved.
//

import Foundation
import AudioToolbox.AudioServices

@objc(TouchFeedback)
class TouchFeedback: NSObject {
  @objc
  func vibrateHigh() {
    let peek = SystemSoundID(1521)
    AudioServicesPlaySystemSound(peek)
    print("vibrating high!")
  }
  
  @objc
  func vibrateMedium() {
    let peek = SystemSoundID(1520)
    AudioServicesPlaySystemSound(peek)
    print("vibrating medium!")
  }
  
  @objc
  func vibrateLow() {
    let peek = SystemSoundID(1519)
    AudioServicesPlaySystemSound(peek)
    print("vibrating low!")
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}


