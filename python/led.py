import RPi.GPIO as gpio

class LED:
    def __init__(self,led_pin):
        self.led_pin = led_pin
        gpio.setmode(gpio.BCM)
        gpio.setup(self.led_pin,gpio.OUT)
        
    def led_on(self):
        gpio.output(self.led_pin, gpio.HIGH)
    
    def led_off(self):
        gpio.output(self.led_pin, gpio.LOW)
    
    def clean(self):
        gpio.cleanup()