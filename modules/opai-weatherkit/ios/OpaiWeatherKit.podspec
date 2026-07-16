Pod::Spec.new do |s|
  s.name           = 'OpaiWeatherKit'
  s.version        = '1.0.0'
  s.summary        = 'Native Apple WeatherKit bridge for OPAi Police'
  s.description    = 'Provides current Apple Weather conditions directly on supported iOS devices.'
  s.author         = 'OPAi'
  s.homepage       = 'https://opaiapp.com'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: 'https://github.com/Saman1981OPAi/opai-mobile.git' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'CoreLocation', 'WeatherKit'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
